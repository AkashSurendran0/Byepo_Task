import { injectable } from "inversify";
import { IUserRepository } from "../../domain/repositories/user-repository";
import { IUserModel, UserModal, UserRole } from "../models/user-model";

@injectable()
export class UserRepository implements IUserRepository {
    async create(data: {
        name: string;
        email: string;
        password: string;
        role: UserRole;
        organization: string;
    }): Promise<IUserModel> {
        return UserModal.create(data);
    }

    async findByEmail(email: string): Promise<IUserModel | null> {
        return UserModal.findOne({ email });
    }

    async findByEmailAndRole(email: string, role: UserRole): Promise<IUserModel | null> {
        return UserModal.findOne({ email, role });
    }
}
