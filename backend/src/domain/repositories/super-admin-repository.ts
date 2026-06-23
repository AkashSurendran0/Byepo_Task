export interface ISuperAdminRepository {
    validateLogin(email: string, password: string): Promise<boolean>
}