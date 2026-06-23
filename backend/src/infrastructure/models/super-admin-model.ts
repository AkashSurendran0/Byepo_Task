import mongoose, { Document, Model, Schema } from "mongoose";

export interface ISuperAdminModel extends Document{
    email: string;
    password: string;
}

const superAdminSchema: Schema<ISuperAdminModel>=new Schema({
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    }
})

export const SuperAdminModal:Model<ISuperAdminModel>=mongoose.model<ISuperAdminModel>('SuperAdmin', superAdminSchema)