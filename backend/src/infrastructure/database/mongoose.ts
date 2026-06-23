import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export const dbConnect = async () => {
    try {
        await mongoose.connect(process.env.MONGO_ATLAS_URL as string);
        console.log("Mongodb connected successfully");
    } catch (error: unknown) {
        if (error instanceof Error) console.error({ err: error }, "Mongodb connection failed");
        else console.error({ error }, "Mongodb connection failed");
    }
};