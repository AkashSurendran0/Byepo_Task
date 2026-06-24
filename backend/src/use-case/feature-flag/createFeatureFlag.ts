import { inject, injectable } from "inversify";
import { TYPES } from "../../TYPES";
import { IFeatureFlagRepository } from "../../domain/repositories/feature-flag-repository";
import { ICreateFeatureFlag } from "../../domain/use-case/feature-flag-usecase";
import { UseCaseResponse } from "../../domain/use-case/organization-usecase";
import { isDuplicateKeyError, normalizeFeatureKey, validateOrganizationAccess } from "./featureFlagHelpers";

@injectable()
export class CreateFeatureFlag implements ICreateFeatureFlag {
    constructor(
        @inject(TYPES.IFeatureFlagRepository) private _featureFlagRepository: IFeatureFlagRepository
    ) {}

    async execute(organizationId: string | undefined, data: {
        featureKey?: unknown;
        enabled?: unknown;
    }): Promise<UseCaseResponse<Record<string, unknown>>> {
        const accessError = validateOrganizationAccess(organizationId);
        if (accessError) return accessError;

        const featureKey = normalizeFeatureKey(data.featureKey);
        const enabled = Boolean(data.enabled);
        if (!featureKey) {
            return { status: 400, body: { message: "Feature key is required" } };
        }

        try {
            const flag = await this._featureFlagRepository.create({
                featureKey,
                enabled,
                organization: organizationId as string,
            });
            return { status: 201, body: { message: "Feature flag created", flag } };
        } catch (error) {
            if (isDuplicateKeyError(error)) {
                return { status: 409, body: { message: "Feature key already exists" } };
            }
            throw error;
        }
    }
}
