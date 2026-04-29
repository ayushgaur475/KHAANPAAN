import mongoose from "mongoose";
import userModel from "./models/userModel.js";
import 'dotenv/config';

const makeAdmin = async (email) => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to DB");
        
        const user = await userModel.findOne({ email });
        if (!user) {
            console.log("User not found. Make sure you registered on the frontend first!");
            process.exit();
        }
        
        user.isAdmin = true;
        await user.save();
        console.log(`User ${email} is now an Admin!`);
        process.exit();
    } catch (error) {
        console.error(error);
        process.exit();
    }
}

const email = process.argv[2];
if (!email) {
    console.log("Please provide an email: node make_admin.js your@email.com");
} else {
    makeAdmin(email);
}
