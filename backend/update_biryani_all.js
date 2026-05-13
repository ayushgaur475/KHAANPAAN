import fs from 'fs';
import https from 'https';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

// Mongoose Model
const foodSchema = new mongoose.Schema({
    name: {type:String, required:true},
    description: {type:String, required:true},
    price: {type:Number, required:true},
    image: {type:String, required:true},
    category: {type:String, required:true},
    veg: {type:Boolean, required:true},
    inStock: {type:Boolean, default:true}
});
const foodModel = mongoose.models.food || mongoose.model("food", foodSchema);

const imageUrl = "https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?auto=format&fit=crop&w=500&q=80";
const categoryImagePath = path.join(process.cwd(), '../frontend/src/assets/menu_12.png');

const downloadImage = (url, filepath) => {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            if (res.statusCode === 200) {
                res.pipe(fs.createWriteStream(filepath))
                   .on('error', reject)
                   .once('close', () => resolve(filepath));
            } else {
                res.resume();
                reject(new Error(`Request Failed With a Status Code: ${res.statusCode}`));
            }
        });
    });
};

const updateDBAndAssets = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || "mongodb+srv://khaanpaan:ayush123@cluster0.b73nttc.mongodb.net/KHAANPAAN", {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("Connected to DB");

        console.log("Downloading Biryani image...");
        await downloadImage(imageUrl, categoryImagePath);
        console.log("Saved menu_12.png for category icon.");

        // Read the image as base64 for the DB
        const imageBuffer = fs.readFileSync(categoryImagePath);
        const base64Image = `data:image/png;base64,${imageBuffer.toString('base64')}`;

        // Update all biryani items in the database
        const biryanis = [
            "Hyderabadi Chicken Biryani",
            "Muradabadi Chicken Biryani",
            "Egg Biryani",
            "Mutton Biryani",
            "Lucknowi Dum Biryani"
        ];

        for (let name of biryanis) {
            const result = await foodModel.findOneAndUpdate({ name }, { image: base64Image });
            if (result) {
                console.log(`Updated image for: ${name}`);
            }
        }

        console.log("All Biryani items and categories updated successfully!");
        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

updateDBAndAssets();
