export type UseCaseResponse<TBody> = {
    status: number;
    body: TBody;
}

export interface ICreateOrganization {
    execute(name: unknown): Promise<UseCaseResponse<Record<string, unknown>>>;
}

export interface IListOrganizations {
    execute(): Promise<UseCaseResponse<Record<string, unknown>>>;
}

export interface IListOrganizationsForSelection {
    execute(): Promise<UseCaseResponse<Record<string, unknown>>>;
}
