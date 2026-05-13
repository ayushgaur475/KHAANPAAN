import mongoose from "mongoose";
import foodModel from "./models/foodModel.js";
import dotenv from "dotenv";

dotenv.config();

const imageUpdates = [
  {
    name: "Matar Paneer",
    imageUrl: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80"
  },
  {
    name: "Muttor Mushroom",
    imageUrl: "https://images.unsplash.com/photo-1627308595229-7830a5c91f9f?auto=format&fit=crop&w=800&q=80"
  },
  {
    name: "Chicken Masala",
    imageUrl: "https://images.unsplash.com/photo-1603894584214-5d9884570086?auto=format&fit=crop&w=800&q=80"
  },
  {
    name: "Egg Curry",
    imageUrl: "https://images.unsplash.com/photo-1542310503-24a40004e2f6?auto=format&fit=crop&w=800&q=80"
  },
  {
    name: "Fish Curry",
    imageUrl: "https://images.unsplash.com/photo-1626074353765-517a681e40be?auto=format&fit=crop&w=800&q=80"
  },
  {
    name: "Mutton Curry",
    imageUrl: "https://images.unsplash.com/photo-1545247181-516773cae754?auto=format&fit=crop&w=800&q=80"
  }
];

const updateDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || "mongodb+srv://khaanpaan:ayush123@cluster0.b73nttc.mongodb.net/KHAANPAAN", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to DB");

    for (let update of imageUpdates) {
      const result = await foodModel.findOneAndUpdate(
        { name: update.name },
        { image: update.imageUrl },
        { new: true }
      );
      if (result) {
        console.log(`Updated image for: ${update.name}`);
      } else {
        console.log(`Could not find item: ${update.name}`);
      }
    }
    
    console.log("Update complete!");
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

updateDB();
