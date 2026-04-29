import mongoose from 'mongoose';

const mongoURI = 'mongodb://localhost:27017/khaanpaan';

const foodSchema = new mongoose.Schema({
    name: String,
    image: String,
    category: String
});

const foodModel = mongoose.models.food || mongoose.model('food', foodSchema);

const updates = [
    { name: "Tandoori Roti", image: "food_42.png" },
    { name: "Butter Naan", image: "food_43.png" },
    { name: "Garlic Naan", image: "food_44.png" },
    { name: "Lachha Paratha", image: "food_45.png" }
];

async function run() {
    try {
        await mongoose.connect(mongoURI);
        console.log('Connected to MongoDB');
        
        for (const update of updates) {
            const result = await foodModel.updateOne(
                { name: update.name, category: 'Bread' },
                { $set: { image: update.image } }
            );
            console.log(`Updated ${update.name}: ${result.modifiedCount} documents modified`);
        }
        
        process.exit(0);
    } catch (err) {
        console.error('Error:', err.message);
        process.exit(1);
    }
}

run();
