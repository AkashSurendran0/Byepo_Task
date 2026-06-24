import { IUserModel, UserRole } from "../../infrastructure/models/user-model";

export interface IUserRepository {
    create(data: {
        name: string;
        email: string;
        password: string;
        role: UserRole;
        organization: string;
    }): Promise<IUserModel>;
    findByEmail(email: string): Promise<IUserModel | null>;
    findByEmailAndRole(email: string, role: UserRole): Promise<IUserModel | null>;
}
