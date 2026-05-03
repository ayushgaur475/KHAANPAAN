import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import 'dotenv/config';

// Define a simple User Schema for the script
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    cartData: { type: Object, default: {} },
    coins: { type: Number, default: 0 },
    isFirstOrder: { type: Boolean, default: true }
}, { minimize: false, timestamps: true });

const userModel = mongoose.models.user || mongoose.model("user", userSchema);

const createAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("🚀 Connected to Database");

        const email = "123@gmail.com";
        const password = "adminpassword";
        const name = "Super Admin";

        // Check if user exists
        const exists = await userModel.findOne({ email });
        if (exists) {
            console.log("⚠️ User already exists. Updating password...");
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            await userModel.findOneAndUpdate({ email }, { password: hashedPassword, name });
            console.log("✅ Admin updated successfully!");
        } else {
            console.log("🆕 Creating new Admin user...");
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            const newUser = new userModel({
                name,
                email,
                password: hashedPassword,
                isFirstOrder: false
            });
            await newUser.save();
            console.log("✅ Admin created successfully!");
        }

        process.exit(0);
    } catch (error) {
        console.error("❌ Error:", error);
        process.exit(1);
    }
};

createAdmin();
