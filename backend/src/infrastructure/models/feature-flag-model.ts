import mongoose, { Document, Model, Schema, Types } from "mongoose";

export interface IFeatureFlagModel extends Document {
    featureKey: string;
    enabled: boolean;
    organization: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const featureFlagSchema: Schema<IFeatureFlagModel> = new Schema(
    {
        featureKey: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
        },
        enabled: {
            type: Boolean,
            default: false,
        },
        organization: {
            type: Schema.Types.ObjectId,
            ref: "Organization",
            required: true,
        },
    },
    { timestamps: true }
);

featureFlagSchema.index({ organization: 1, featureKey: 1 }, { unique: true });

export const FeatureFlagModal: Model<IFeatureFlagModel> =
    mongoose.models.FeatureFlag ||
    mongoose.model<IFeatureFlagModel>("FeatureFlag", featureFlagSchema);
