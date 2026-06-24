import { inject, injectable } from "inversify";
import { Types } from "mongoose";
import { TYPES } from "../../TYPES";
import { IFeatureFlagRepository } from "../../domain/repositories/feature-flag-repository";
import { IDeleteFeatureFlag } from "../../domain/use-case/feature-flag-usecase";
import { UseCaseResponse } from "../../domain/use-case/organization-usecase";
import { validateOrganizationAccess } from "./featureFlagHelpers";

@injectable()
export class DeleteFeatureFlag implements IDeleteFeatureFlag {
    constructor(
        @inject(TYPES.IFeatureFlagRepository) private _featureFlagRepository: IFeatureFlagRepository
    ) {}

    async execute(organizationId: string | undefined, id: unknown): Promise<UseCaseResponse<Record<string, unknown>>> {
        const accessError = validateOrganizationAccess(organizationId);
        if (accessError) return accessError;

        if (typeof id !== "string" || !Types.ObjectId.isValid(id)) {
            return { status: 400, body: { message: "Invalid feature flag" } };
        }

        const flag = await this._featureFlagRepository.delete(id, organizationId as string);
        if (!flag) {
            return { status: 404, body: { message: "Feature flag not found" } };
        }

        return { status: 200, body: { message: "Feature flag deleted" } };
    }
}
