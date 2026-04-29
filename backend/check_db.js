import mongoose from 'mongoose';

const mongoURI = 'mongodb://localhost:27017/khaanpaan';

const foodSchema = new mongoose.Schema({
    name: String,
    description: String,
    price: Number,
    image: String,
    category: String
});

const foodModel = mongoose.models.food || mongoose.model('food', foodSchema);

async function run() {
    try {
        await mongoose.connect(mongoURI);
        console.log('Connected to MongoDB');
        
        const foods = await foodModel.find({ category: 'Beverages' });
        console.log('Current Beverages in DB:');
        console.log(JSON.stringify(foods, null, 2));
        
        process.exit(0);
    } catch (err) {
        console.error('Error:', err.message);
        process.exit(1);
    }
}

run();
