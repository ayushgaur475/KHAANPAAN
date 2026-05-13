import mongoose from "mongoose";
import foodModel from "./models/foodModel.js";
import dotenv from "dotenv";

dotenv.config();

const biryaniItems = [
  {
    name: "Hyderabadi Chicken Biryani",
    description: "Authentic spicy Hyderabadi dum biryani with tender chicken and aromatic basmati rice.",
    price: 280,
    category: "Biryani",
    veg: false
  },
  {
    name: "Muradabadi Chicken Biryani",
    description: "Light and flavorful Muradabadi style chicken biryani cooked with mild spices.",
    price: 250,
    category: "Biryani",
    veg: false
  },
  {
    name: "Egg Biryani",
    description: "Delicious and spicy biryani cooked with hard-boiled eggs and fragrant rice.",
    price: 200,
    category: "Biryani",
    veg: false
  },
  {
    name: "Mutton Biryani",
    description: "Rich and royal mutton biryani slow-cooked to perfection with premium spices.",
    price: 380,
    category: "Biryani",
    veg: false
  },
  {
    name: "Lucknowi Dum Biryani",
    description: "Classic Awadhi style aromatic dum biryani with a delicate blend of spices.",
    price: 320,
    category: "Biryani",
    veg: false
  }
];

const seedBiryani = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || "mongodb+srv://khaanpaan:ayush123@cluster0.b73nttc.mongodb.net/KHAANPAAN", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to DB");

    const placeholderBase64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";

    for (let item of biryaniItems) {
      const newFood = new foodModel({
        name: item.name,
        description: item.description,
        price: item.price,
        category: item.category,
        image: placeholderBase64,
        veg: item.veg,
        inStock: true
      });
      
      await newFood.save();
      console.log(`Added: ${item.name}`);
    }
    
    console.log("Biryani seeding complete!");
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedBiryani();
