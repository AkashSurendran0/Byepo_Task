import { Response } from "express";
import { inject, injectable } from "inversify";
import { TYPES } from "../TYPES";
import {
    ICheckFeatureFlag,
    ICreateFeatureFlag,
    IDeleteFeatureFlag,
    IListFeatureFlags,
    IUpdateFeatureFlag,
} from "../domain/use-case/feature-flag-usecase";
import { AuthRequest } from "../middleware/auth-middleware";

@injectable()
export class FeatureFlagController {
    constructor(
        @inject(TYPES.IListFeatureFlags) private _listFeatureFlags: IListFeatureFlags,
        @inject(TYPES.ICreateFeatureFlag) private _createFeatureFlag: ICreateFeatureFlag,
        @inject(TYPES.IUpdateFeatureFlag) private _updateFeatureFlag: IUpdateFeatureFlag,
        @inject(TYPES.IDeleteFeatureFlag) private _deleteFeatureFlag: IDeleteFeatureFlag,
        @inject(TYPES.ICheckFeatureFlag) private _checkFeatureFlag: ICheckFeatureFlag
    ) {}

    list = async (req: AuthRequest, res: Response) => {
        try {
            const result = await this._listFeatureFlags.execute(req.auth?.organization);
            res.status(result.status).json(result.body);
        } catch (error) {
            res.status(500).json({ message: "Internal server error" });
        }
    };

    create = async (req: AuthRequest, res: Response) => {
        try {
            const result = await this._createFeatureFlag.execute(req.auth?.organization, req.body);
            res.status(result.status).json(result.body);
        } catch (error) {
            res.status(500).json({ message: "Internal server error" });
        }
    };

    update = async (req: AuthRequest, res: Response) => {
        try {
            const result = await this._updateFeatureFlag.execute(req.auth?.organization, req.params.id, req.body);
            res.status(result.status).json(result.body);
        } catch (error) {
            res.status(500).json({ message: "Internal server error" });
        }
    };

    delete = async (req: AuthRequest, res: Response) => {
        try {
            const result = await this._deleteFeatureFlag.execute(req.auth?.organization, req.params.id);
            res.status(result.status).json(result.body);
        } catch (error) {
            res.status(500).json({ message: "Internal server error" });
        }
    };

    check = async (req: AuthRequest, res: Response) => {
        try {
            const result = await this._checkFeatureFlag.execute(req.auth?.organization, req.body.featureKey);
            res.status(result.status).json(result.body);
        } catch (error) {
            res.status(500).json({ message: "Internal server error" });
        }
    };
}
