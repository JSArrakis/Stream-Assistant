import mongoose from "mongoose";
import { ConnectionOptions } from "tls";

const uri: string = "mongodb://127.0.0.1:27017/streamAssistantMedia";
export async function connectToDB() {
    await mongoose.connect(uri)
        .then(() => {
            console.log("Connected to Mongo");
        }, (err) => {
            console.log("Error connecting to Mongo: ", err);
        });
}
