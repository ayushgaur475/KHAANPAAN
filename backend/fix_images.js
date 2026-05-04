import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const foodSchema = new mongoose.Schema({ name: String, image: String, category: String }, { strict: false });
const foodModel = mongoose.models.food || mongoose.model('food', foodSchema);

async function run() {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB Atlas');

    // Find all items whose image name starts with a timestamp prefix (e.g. "1777...")
    const items = await foodModel.find({ image: /^\d{13}_/ });
    console.log(`Found ${items.length} items with broken timestamp-prefixed image names.`);

    let fixed = 0;
    for (const item of items) {
        // Strip the timestamp prefix: "1777727621443_food_1.png" -> "food_1.png"
        const cleanImage = item.image.replace(/^\d+_/, '');
        await foodModel.updateOne({ _id: item._id }, { $set: { image: cleanImage } });
        console.log(`  ✓ Fixed "${item.name}": ${item.image} -> ${cleanImage}`);
        fixed++;
    }

    console.log(`\n✅ Done! Fixed ${fixed} items.`);
    process.exit(0);
}

run().catch(err => { console.error(err); process.exit(1); });
