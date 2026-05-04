import mongoose from 'mongoose';

const mongoURI = 'mongodb://Ayush-user:a1yush006@ac-nqljrz2-shard-00-00.ib3iifr.mongodb.net:27017,ac-nqljrz2-shard-00-01.ib3iifr.mongodb.net:27017,ac-nqljrz2-shard-00-02.ib3iifr.mongodb.net:27017/khaanpaan?ssl=true&replicaSet=atlas-q2qv5f-shard-0&authSource=admin&retryWrites=true&w=majority';

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
    { name: "Lachha Paratha", image: "food_45.png" },
    { name: "Fresh Lime Soda", image: "food_39.png" },
    // Fix timestamp-prefixed broken references
    { name: "Butter Naan",    image: "menu_11.png" },
    { name: "Garlic Naan",    image: "menu_11.png" },
    { name: "Lachha Paratha", image: "menu_11.png" },
    { name: "Fresh Lime Soda", image: "menu_10.png" }
];

async function run() {
    try {
        await mongoose.connect(mongoURI);
        console.log('Connected to MongoDB');
        
        for (const update of updates) {
            const result = await foodModel.updateOne(
                { name: update.name },
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
