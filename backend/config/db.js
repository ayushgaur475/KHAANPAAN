import mongoose from "mongoose";

let gridfsBucket;

export const connectDB = async () => {
    try {
        const conn = await mongoose.connect(`${process.env.MONGO_URI}`);
        console.log(`DB connected successfully`);

        const db = conn.connection.db;
        gridfsBucket = new mongoose.mongo.GridFSBucket(db, {
            bucketName: 'uploads'
        });

        console.log("GridFS initialized");
        return { gridfsBucket };
    } catch (error) {
        console.error("DB Connection Error:", error);
        process.exit(1); // Exit if DB connection fails
    }
}

export const getGridFSBucket = () => gridfsBucket;