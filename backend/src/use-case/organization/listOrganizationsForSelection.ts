import { inject, injectable } from "inversify";
import { TYPES } from "../../TYPES";
import { IOrganizationRepository } from "../../domain/repositories/organization-repository";
import { IListOrganizationsForSelection, UseCaseResponse } from "../../domain/use-case/organization-usecase";

@injectable()
export class ListOrganizationsForSelection implements IListOrganizationsForSelection {
    constructor(
        @inject(TYPES.IOrganizationRepository) private _organizationRepository: IOrganizationRepository
    ) {}

    async execute(): Promise<UseCaseResponse<Record<string, unknown>>> {
        const organizations = await this._organizationRepository.listForSelection();
        return { status: 200, body: { organizations } };
    }
}
