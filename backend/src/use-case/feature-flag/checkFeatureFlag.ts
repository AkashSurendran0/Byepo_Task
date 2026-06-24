import { inject, injectable } from "inversify";
import { TYPES } from "../../TYPES";
import { IFeatureFlagRepository } from "../../domain/repositories/feature-flag-repository";
import { ICheckFeatureFlag } from "../../domain/use-case/feature-flag-usecase";
import { UseCaseResponse } from "../../domain/use-case/organization-usecase";
import { normalizeFeatureKey, validateOrganizationAccess } from "./featureFlagHelpers";

@injectable()
export class CheckFeatureFlag implements ICheckFeatureFlag {
    constructor(
        @inject(TYPES.IFeatureFlagRepository) private _featureFlagRepository: IFeatureFlagRepository
    ) {}

    async execute(organizationId: string | undefined, featureKeyValue: unknown): Promise<UseCaseResponse<Record<string, unknown>>> {
        const accessError = validateOrganizationAccess(organizationId);
        if (accessError) return accessError;

        const featureKey = normalizeFeatureKey(featureKeyValue);
        if (!featureKey) {
            return { status: 400, body: { message: "Feature key is required" } };
        }

        const flag = await this._featureFlagRepository.findByOrganizationAndKey(organizationId as string, featureKey);
        return {
            status: 200,
            body: {
                featureKey,
                enabled: Boolean(flag?.enabled),
            },
        };
    }
}
