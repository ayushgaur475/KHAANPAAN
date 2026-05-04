import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const foodSchema = new mongoose.Schema({ name: String, image: String, category: String }, { strict: false });
const foodModel = mongoose.models.food || mongoose.model('food', foodSchema);

async function run() {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB Atlas');

    const updates = [
        { name: "Coca Cola", image: "food_38.png" },
        { name: "Pepsi", image: "food_39.png" },
        { name: "Sprite", image: "food_40.png" },
        { name: "Fresh Lime Soda", image: "food_41.jpg" }
    ];

    for (const update of updates) {
        const result = await foodModel.updateOne({ name: update.name }, { $set: { image: update.image } });
        console.log(`Updated ${update.name}: ${result.modifiedCount} documents modified`);
    }

    console.log('\n✅ Beverages updated successfully!');
    process.exit(0);
}

run().catch(err => { console.error(err); process.exit(1); });
