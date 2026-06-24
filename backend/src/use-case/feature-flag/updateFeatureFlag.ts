import { inject, injectable } from "inversify";
import { Types } from "mongoose";
import { TYPES } from "../../TYPES";
import { IFeatureFlagRepository } from "../../domain/repositories/feature-flag-repository";
import { IUpdateFeatureFlag } from "../../domain/use-case/feature-flag-usecase";
import { UseCaseResponse } from "../../domain/use-case/organization-usecase";
import { isDuplicateKeyError, normalizeFeatureKey, validateOrganizationAccess } from "./featureFlagHelpers";

@injectable()
export class UpdateFeatureFlag implements IUpdateFeatureFlag {
    constructor(
        @inject(TYPES.IFeatureFlagRepository) private _featureFlagRepository: IFeatureFlagRepository
    ) {}

    async execute(organizationId: string | undefined, id: unknown, data: {
        featureKey?: unknown;
        enabled?: unknown;
    }): Promise<UseCaseResponse<Record<string, unknown>>> {
        const accessError = validateOrganizationAccess(organizationId);
        if (accessError) return accessError;

        if (typeof id !== "string" || !Types.ObjectId.isValid(id)) {
            return { status: 400, body: { message: "Invalid feature flag" } };
        }

        const featureKey = normalizeFeatureKey(data.featureKey);
        const update: { featureKey?: string; enabled?: boolean } = {};
        if (featureKey) update.featureKey = featureKey;
        if (typeof data.enabled === "boolean") update.enabled = data.enabled;

        if (!Object.keys(update).length) {
            return { status: 400, body: { message: "No changes provided" } };
        }

        try {
            const flag = await this._featureFlagRepository.update(id, organizationId as string, update);
            if (!flag) {
                return { status: 404, body: { message: "Feature flag not found" } };
            }

            return { status: 200, body: { message: "Feature flag updated", flag } };
        } catch (error) {
            if (isDuplicateKeyError(error)) {
                return { status: 409, body: { message: "Feature key already exists" } };
            }
            throw error;
        }
    }
}
