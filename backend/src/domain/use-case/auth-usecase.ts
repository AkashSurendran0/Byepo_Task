import { UserRole } from "../../infrastructure/models/user-model";
import { UseCaseResponse } from "./organization-usecase";

export interface ISignupUser {
    execute(role: UserRole, data: {
        name?: unknown;
        email?: unknown;
        password?: unknown;
        organizationId?: unknown;
    }): Promise<UseCaseResponse<Record<string, unknown>>>;
}

export interface ILoginUser {
    execute(role: UserRole, data: {
        email?: unknown;
        password?: unknown;
    }): Promise<UseCaseResponse<Record<string, unknown>>>;
}
