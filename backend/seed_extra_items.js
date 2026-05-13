import mongoose from "mongoose";
import foodModel from "./models/foodModel.js";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

const items = [
  {
    name: "Egg Roll",
    description: "Delicious Indian-style Egg Roll wrapper filled with onions, sauces, and spices, wrapped in a paratha.",
    price: 60,
    category: "Rolls",
    veg: false,
    imagePath: "C:\\Users\\Ayush\\.gemini\\antigravity\\brain\\7e937dfc-f87f-44de-af26-8ddbb00d60ab\\egg_roll_1778696921180.png"
  },
  {
    name: "Egg Chicken Roll",
    description: "Spiced chicken chunks, onions, and sauces wrapped with an egg paratha.",
    price: 100,
    category: "Rolls",
    veg: false,
    imagePath: "C:\\Users\\Ayush\\.gemini\\antigravity\\brain\\7e937dfc-f87f-44de-af26-8ddbb00d60ab\\egg_chicken_roll_1778696947871.png"
  },
  {
    name: "Paneer Roll",
    description: "Spiced paneer chunks, onions, and mint chutney wrapped in a paratha.",
    price: 80,
    category: "Rolls",
    veg: true,
    imagePath: "C:\\Users\\Ayush\\.gemini\\antigravity\\brain\\7e937dfc-f87f-44de-af26-8ddbb00d60ab\\paneer_roll_1778697104426.png"
  },
  {
    name: "Chole Chawal",
    description: "Spicy chickpea curry served over steamed basmati rice.",
    price: 120,
    category: "Indian",
    veg: true,
    imagePath: "C:\\Users\\Ayush\\.gemini\\antigravity\\brain\\7e937dfc-f87f-44de-af26-8ddbb00d60ab\\chole_chawal_1778697252203.png"
  },
  {
    name: "Kadhi Chawal",
    description: "Yogurt-based curry with pakoras served over steamed basmati rice.",
    price: 110,
    category: "Indian",
    veg: true,
    imagePath: "C:\\Users\\Ayush\\.gemini\\antigravity\\brain\\7e937dfc-f87f-44de-af26-8ddbb00d60ab\\kadhi_chawal_1778697480831.png"
  },
  {
    name: "Matar Paneer",
    description: "Indian Matar Paneer (peas and paneer cheese in a rich tomato gravy).",
    price: 150,
    category: "Indian",
    veg: true,
    imagePath: null
  },
  {
    name: "Muttor Mushroom",
    description: "Indian Matar Mushroom (peas and mushrooms in a spicy brown gravy).",
    price: 160,
    category: "Indian",
    veg: true,
    imagePath: null
  },
  {
    name: "Chicken Masala",
    description: "Spicy chicken curry in a thick red gravy.",
    price: 220,
    category: "Indian",
    veg: false,
    imagePath: null
  },
  {
    name: "Egg Curry",
    description: "Hard-boiled eggs in a spicy tomato-onion gravy.",
    price: 130,
    category: "Indian",
    veg: false,
    imagePath: null
  },
  {
    name: "Fish Curry",
    description: "Fish pieces cooked in a tangy, spicy mustard or coconut gravy.",
    price: 250,
    category: "Indian",
    veg: false,
    imagePath: null
  },
  {
    name: "Mutton Curry",
    description: "Tender meat pieces slow-cooked in a dark, spicy gravy.",
    price: 300,
    category: "Indian",
    veg: false,
    imagePath: null
  }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || "mongodb+srv://khaanpaan:ayush123@cluster0.b73nttc.mongodb.net/KHAANPAAN", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to DB");

    const placeholderBase64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";

    for (let item of items) {
      let base64Image = placeholderBase64;
      
      if (item.imagePath && fs.existsSync(item.imagePath)) {
         const imageBuffer = fs.readFileSync(item.imagePath);
         base64Image = `data:image/png;base64,${imageBuffer.toString('base64')}`;
      }
      
      const newFood = new foodModel({
        name: item.name,
        description: item.description,
        price: item.price,
        category: item.category,
        image: base64Image,
        veg: item.veg,
        inStock: true
      });
      
      await newFood.save();
      console.log(`Added: ${item.name}`);
    }
    
    console.log("Seeding complete!");
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedDB();
