import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

async function grantFirstOrder() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const db = mongoose.connection.db;
        
        // Update all users who don't have the isFirstOrder field yet
        const result = await db.collection('users').updateMany(
            { isFirstOrder: { $exists: false } },
            { $set: { isFirstOrder: true } }
        );
        
        console.log(`Successfully updated ${result.modifiedCount} users with First Order status.`);
        process.exit(0);
    } catch (error) {
        console.error("Migration Error:", error);
        process.exit(1);
    }
}

grantFirstOrder();
