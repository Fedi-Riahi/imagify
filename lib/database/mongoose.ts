import mongoose, { Mongoose } from "mongoose";

const MONGODB_URL = process.env.MONGO_URL;

interface MongooseConnection {
    conn: Mongoose | null;
    promise: Promise<Mongoose> | null;
}

// Extend the global namespace to include mongoose
declare global {
    namespace NodeJS {
        interface Global {
            mongoose: MongooseConnection;
        }
    }
}

let cached: MongooseConnection = global.mongoose || { conn: null, promise: null };

if (!global.mongoose) {
    global.mongoose = cached;
}

export const connectToDatabase = async () => {
    if (cached.conn) {
        return cached.conn;
    }
    if (!MONGODB_URL) {
        throw new Error("MongoDB URL is not defined");
    }

    cached.promise = cached.promise || mongoose.connect(MONGODB_URL, {
        dbName: "imagify",
        bufferCommands: false,
    }).then(mongoose => mongoose);

    cached.conn = await cached.promise;

    return cached.conn;
};
