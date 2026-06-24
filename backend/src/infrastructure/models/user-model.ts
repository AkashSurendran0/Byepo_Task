import mongoose, { Document, Model, Schema, Types } from "mongoose";

export type UserRole = "organization_admin" | "end_user";

export interface IUserModel extends Document {
    name: string;
    email: string;
    password: string;
    role: UserRole;
    organization: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const userSchema: Schema<IUserModel> = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        password: {
            type: String,
            required: true,
        },
        role: {
            type: String,
            enum: ["organization_admin", "end_user"],
            required: true,
        },
        organization: {
            type: Schema.Types.ObjectId,
            ref: "Organization",
            required: true,
        },
    },
    { timestamps: true }
);

userSchema.index({ email: 1, role: 1 });
userSchema.index({ organization: 1, role: 1 });

export const UserModal: Model<IUserModel> =
    mongoose.models.User || mongoose.model<IUserModel>("User", userSchema);
