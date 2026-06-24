import { inject, injectable } from "inversify";
import { TYPES } from "../../TYPES";
import { IOrganizationRepository } from "../../domain/repositories/organization-repository";
import { IListOrganizations, UseCaseResponse } from "../../domain/use-case/organization-usecase";

@injectable()
export class ListOrganizations implements IListOrganizations {
    constructor(
        @inject(TYPES.IOrganizationRepository) private _organizationRepository: IOrganizationRepository
    ) {}

    async execute(): Promise<UseCaseResponse<Record<string, unknown>>> {
        const organizations = await this._organizationRepository.listForSuperAdmin();
        return { status: 200, body: { organizations } };
    }
}
