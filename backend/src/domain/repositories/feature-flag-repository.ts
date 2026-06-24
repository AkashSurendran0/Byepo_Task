import { IFeatureFlagModel } from "../../infrastructure/models/feature-flag-model";

export interface IFeatureFlagRepository {
    listByOrganization(organization: string): Promise<IFeatureFlagModel[]>;
    create(data: { featureKey: string; enabled: boolean; organization: string }): Promise<IFeatureFlagModel>;
    update(
        id: string,
        organization: string,
        update: { featureKey?: string; enabled?: boolean }
    ): Promise<IFeatureFlagModel | null>;
    delete(id: string, organization: string): Promise<IFeatureFlagModel | null>;
    findByOrganizationAndKey(organization: string, featureKey: string): Promise<IFeatureFlagModel | null>;
}
