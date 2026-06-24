import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { TYPES } from "../TYPES";
import {
    ICreateOrganization,
    IListOrganizations,
    IListOrganizationsForSelection,
} from "../domain/use-case/organization-usecase";

@injectable()
export class OrganizationController {
    constructor(
        @inject(TYPES.ICreateOrganization) private _createOrganization: ICreateOrganization,
        @inject(TYPES.IListOrganizations) private _listOrganizations: IListOrganizations,
        @inject(TYPES.IListOrganizationsForSelection) private _listOrganizationsForSelection: IListOrganizationsForSelection
    ) {}

    listForSelection = async (_req: Request, res: Response) => {
        try {
            const result = await this._listOrganizationsForSelection.execute();
            res.status(result.status).json(result.body);
        } catch (error) {
            res.status(500).json({ message: "Internal server error" });
        }
    };

    listForSuperAdmin = async (_req: Request, res: Response) => {
        try {
            const result = await this._listOrganizations.execute();
            res.status(result.status).json(result.body);
        } catch (error) {
            res.status(500).json({ message: "Internal server error" });
        }
    };

    create = async (req: Request, res: Response) => {
        try {
            const result = await this._createOrganization.execute(req.body.name);
            res.status(result.status).json(result.body);
        } catch (error) {
            res.status(500).json({ message: "Internal server error" });
        }
    };
}
