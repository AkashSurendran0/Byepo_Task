import { UseCaseResponse } from "./organization-usecase";

export interface IListFeatureFlags {
    execute(organizationId?: string): Promise<UseCaseResponse<Record<string, unknown>>>;
}

export interface ICreateFeatureFlag {
    execute(organizationId: string | undefined, data: {
        featureKey?: unknown;
        enabled?: unknown;
    }): Promise<UseCaseResponse<Record<string, unknown>>>;
}

export interface IUpdateFeatureFlag {
    execute(organizationId: string | undefined, id: unknown, data: {
        featureKey?: unknown;
        enabled?: unknown;
    }): Promise<UseCaseResponse<Record<string, unknown>>>;
}

export interface IDeleteFeatureFlag {
    execute(organizationId: string | undefined, id: unknown): Promise<UseCaseResponse<Record<string, unknown>>>;
}

export interface ICheckFeatureFlag {
    execute(organizationId: string | undefined, featureKey: unknown): Promise<UseCaseResponse<Record<string, unknown>>>;
}
