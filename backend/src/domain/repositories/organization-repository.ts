import { Types } from "mongoose";
import { IOrganizationModel } from "../../infrastructure/models/organization-model";

export interface IOrganizationRepository {
    create(name: string): Promise<IOrganizationModel>;
    findById(id: string): Promise<IOrganizationModel | null>;
    findByNameCaseInsensitive(name: string): Promise<IOrganizationModel | null>;
    listForSelection(): Promise<IOrganizationModel[]>;
    listForSuperAdmin(): Promise<Array<{ _id: Types.ObjectId; name: string; createdAt: Date; adminCount: number }>>;
}
