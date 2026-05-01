import mongoose from "mongoose";
import Grid from "gridfs-stream";

let gfs, gridfsBucket;

export const connectDB = async () => {
    try {
        const conn = await mongoose.connect(`${process.env.MONGO_URI}`);
        console.log(`DB connected successfully`);

        const db = conn.connection.db;
        gridfsBucket = new mongoose.mongo.GridFSBucket(db, {
            bucketName: 'uploads'
        });

        gfs = Grid(db, mongoose.mongo);
        gfs.collection('uploads');
        
        console.log("GridFS initialized");
    } catch (error) {
        console.error("DB Connection Error:", error);
    }
}

export { gfs, gridfsBucket };