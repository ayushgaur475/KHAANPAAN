import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

async function lockUser() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const db = mongoose.connection.db;
        
        const emailToLock = 'ayushgaur475@gmail.com';
        const result = await db.collection('users').updateOne(
            { email: emailToLock },
            { $set: { isFirstOrder: false } }
        );
        
        console.log(`User ${emailToLock} is now locked. Modified: ${result.modifiedCount}`);
        process.exit(0);
    } catch (error) {
        console.error("Lock Error:", error);
        process.exit(1);
    }
}

lockUser();
