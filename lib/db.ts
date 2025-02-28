import mongoose from "mongoose";

// Get MongoDB URI from environment variables

const MONGODB_URI = process.env.MONGODB_URI!

if(!MONGODB_URI){
    throw new Error("Please define mongodb uri in env file")
}

// Global cache to store connection (useful for serverless environments)
let cached = global.mongoose

if(!cached){
    cached = global.mongoose = {
        conn:null,
        promise:null
    }
}

export async function connectToDatabse(){
    // Return cached connection if already connected
    if(cached.conn){
        return cached.conn
    }

    if(!cached.promise){
        const opts = {
            bufferCommands: true, // Allows queries to wait until connection is established
            maxPoolSize: 10, // Limits maximum concurrent connections
        }

        cached.promise = mongoose
        .connect(MONGODB_URI,opts)
        .then(()=>mongoose.connection)
    }

    try {
        cached.conn = await cached.promise
    } catch (error) {
        throw error
    }
    return cached.conn; // Return the database connection
}