import { inject, injectable } from "inversify";
import { TYPES } from "../../TYPES";
import { IFeatureFlagRepository } from "../../domain/repositories/feature-flag-repository";
import { IListFeatureFlags } from "../../domain/use-case/feature-flag-usecase";
import { UseCaseResponse } from "../../domain/use-case/organization-usecase";
import { validateOrganizationAccess } from "./featureFlagHelpers";

@injectable()
export class ListFeatureFlags implements IListFeatureFlags {
    constructor(
        @inject(TYPES.IFeatureFlagRepository) private _featureFlagRepository: IFeatureFlagRepository
    ) {}

    async execute(organizationId?: string): Promise<UseCaseResponse<Record<string, unknown>>> {
        const accessError = validateOrganizationAccess(organizationId);
        if (accessError) return accessError;

        const flags = await this._featureFlagRepository.listByOrganization(organizationId as string);
        return { status: 200, body: { flags } };
    }
}
