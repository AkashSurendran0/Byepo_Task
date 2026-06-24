import { inject, injectable } from "inversify";
import { TYPES } from "../../TYPES";
import { IOrganizationRepository } from "../../domain/repositories/organization-repository";
import { ICreateOrganization, UseCaseResponse } from "../../domain/use-case/organization-usecase";

@injectable()
export class CreateOrganization implements ICreateOrganization {
    constructor(
        @inject(TYPES.IOrganizationRepository) private _organizationRepository: IOrganizationRepository
    ) {}

    async execute(nameValue: unknown): Promise<UseCaseResponse<Record<string, unknown>>> {
        const name = String(nameValue || "").trim();
        if (!name) {
            return { status: 400, body: { message: "Organization name is required" } };
        }

        const existing = await this._organizationRepository.findByNameCaseInsensitive(name);
        if (existing) {
            return { status: 409, body: { message: "Organization already exists" } };
        }

        const organization = await this._organizationRepository.create(name);
        return { status: 201, body: { message: "Organization created", organization } };
    }
}
