import mongoose, { Document, Model, Schema } from "mongoose";

export interface IOrganizationModel extends Document {
    name: string;
    createdAt: Date;
    updatedAt: Date;
}

const organizationSchema: Schema<IOrganizationModel> = new Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
    },
    { timestamps: true }
);

export const OrganizationModal: Model<IOrganizationModel> =
    mongoose.models.Organization ||
    mongoose.model<IOrganizationModel>("Organization", organizationSchema);
