import { injectable } from "inversify";
import { Types } from "mongoose";
import { IFeatureFlagRepository } from "../../domain/repositories/feature-flag-repository";
import { IFeatureFlagModel, FeatureFlagModal } from "../models/feature-flag-model";

@injectable()
export class FeatureFlagRepository implements IFeatureFlagRepository {
    async listByOrganization(organization: string): Promise<IFeatureFlagModel[]> {
        return FeatureFlagModal.find({ organization: new Types.ObjectId(organization) }).sort({ createdAt: -1 });
    }

    async create(data: { featureKey: string; enabled: boolean; organization: string }): Promise<IFeatureFlagModel> {
        return FeatureFlagModal.create({
            featureKey: data.featureKey,
            enabled: data.enabled,
            organization: new Types.ObjectId(data.organization),
        });
    }

    async update(
        id: string,
        organization: string,
        update: { featureKey?: string; enabled?: boolean }
    ): Promise<IFeatureFlagModel | null> {
        return FeatureFlagModal.findOneAndUpdate(
            { _id: new Types.ObjectId(id), organization: new Types.ObjectId(organization) },
            update,
            { returnDocument: "after", runValidators: true }
        );
    }

    async delete(id: string, organization: string): Promise<IFeatureFlagModel | null> {
        return FeatureFlagModal.findOneAndDelete({
            _id: new Types.ObjectId(id),
            organization: new Types.ObjectId(organization),
        });
    }

    async findByOrganizationAndKey(organization: string, featureKey: string): Promise<IFeatureFlagModel | null> {
        return FeatureFlagModal.findOne({ organization: new Types.ObjectId(organization), featureKey });
    }
}
