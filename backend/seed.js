import mongoose from "mongoose";
import foodModel from "./models/foodModel.js";
import dotenv from "dotenv";

dotenv.config();

const foodData = [
    { name: "Classic Greek Salad", image: "food_1.png", price: 12, description: "Fresh cucumbers, tomatoes, and olives topped with premium feta cheese.", category: "Salad", veg: true },
    { name: "Veg salad", image: "food_2.png", price: 18, description: "Food provides essential nutrients for overall health and well-being", category: "Salad", veg: true },
    { name: "Clover Salad", image: "food_3.png", price: 16, description: "Food provides essential nutrients for overall health and well-being", category: "Salad", veg: true },
    { name: "Chicken Salad", image: "food_4.png", price: 24, description: "Food provides essential nutrients for overall health and well-being", category: "Salad", veg: false },
    { name: "Lasagna Rolls", image: "food_5.png", price: 14, description: "Food provides essential nutrients for overall health and well-being", category: "Rolls", veg: true },
    { name: "Peri Peri Rolls", image: "food_6.png", price: 12, description: "Food provides essential nutrients for overall health and well-being", category: "Rolls", veg: false },
    { name: "Chicken Rolls", image: "food_7.png", price: 20, description: "Food provides essential nutrients for overall health and well-being", category: "Rolls", veg: false },
    { name: "Veg Rolls", image: "food_8.png", price: 15, description: "Food provides essential nutrients for overall health and well-being", category: "Rolls", veg: true },
    { name: "Chocolate Ripple Sundae", image: "food_9.png", price: 14, description: "Rich chocolate layers with cream and chocolate syrup drizzle.", category: "Deserts", veg: true },
    { name: "Fresh Mango Sorbet", image: "food_10.png", price: 22, description: "Refreshing frozen mango puree with a hint of citrus.", category: "Deserts", veg: true },
    { name: "Red Velvet Jar Cake", image: "food_11.png", price: 10, description: "Moist red velvet layers with cream cheese frosting in a jar.", category: "Deserts", veg: true },
    { name: "Madagascar Vanilla Bean", image: "food_12.png", price: 12, description: "Classic creamy vanilla made with authentic Madagascar vanilla beans.", category: "Deserts", veg: true },
    { name: "Grilled Chicken Club", image: "food_13.png", price: 12, description: "Tender grilled chicken with lettuce, tomato, and mayo on toasted bread.", category: "Sandwich", veg: false },
    { name: "Vegan Sandwich", image: "food_14.png", price: 18, description: "Food provides essential nutrients for overall health and well-being", category: "Sandwich", veg: true },
    { name: "Grilled Sandwich", image: "food_15.png", price: 16, description: "Food provides essential nutrients for overall health and well-being", category: "Sandwich", veg: true },
    { name: "Bread Sandwich", image: "food_16.png", price: 24, description: "Food provides essential nutrients for overall health and well-being", category: "Sandwich", veg: true },
    { name: "Cup Cake", image: "food_17.png", price: 14, description: "Food provides essential nutrients for overall health and well-being", category: "Cake", veg: true },
    { name: "Vegan Cake", image: "food_18.png", price: 12, description: "Food provides essential nutrients for overall health and well-being", category: "Cake", veg: true },
    { name: "Butterscotch Cake", image: "food_19.png", price: 20, description: "Food provides essential nutrients for overall health and well-being", category: "Cake", veg: true },
    { name: "Sliced Cake", image: "food_20.png", price: 15, description: "Food provides essential nutrients for overall health and well-being", category: "Cake", veg: true },
    { name: "Garlic Mushroom", image: "food_21.png", price: 14, description: "Food provides essential nutrients for overall health and well-being", category: "Pure Veg", veg: true },
    { name: "Fried Cauliflower", image: "food_22.png", price: 22, description: "Food provides essential nutrients for overall health and well-being", category: "Pure Veg", veg: true },
    { name: "Mix Veg Pulao", image: "food_23.png", price: 10, description: "Food provides essential nutrients for overall health and well-being", category: "Pure Veg", veg: true },
    { name: "Rice Zucchini", image: "food_24.png", price: 12, description: "Food provides essential nutrients for overall health and well-being", category: "Pure Veg", veg: true },
    { name: "Four Cheese Pasta", image: "food_25.png", price: 12, description: "Creamy pasta tossed in a blend of parmesan, mozzarella, cheddar, and gouda.", category: "Pasta", veg: true },
    { name: "Tomato Pasta", image: "food_26.png", price: 18, description: "Food provides essential nutrients for overall health and well-being", category: "Pasta", veg: true },
    { name: "Creamy Pasta", image: "food_27.png", price: 16, description: "Food provides essential nutrients for overall health and well-being", category: "Pasta", veg: true },
    { name: "Chicken Pasta", image: "food_28.png", price: 24, description: "Food provides essential nutrients for overall health and well-being", category: "Pasta", veg: false },
    { name: "Buttter Noodles", image: "food_29.png", price: 14, description: "Food provides essential nutrients for overall health and well-being", category: "Noodles", veg: true },
    { name: "Veg Noodles", image: "food_30.png", price: 12, description: "Food provides essential nutrients for overall health and well-being", category: "Noodles", veg: true },
    { name: "Somen Noodles", image: "food_31.png", price: 20, description: "Food provides essential nutrients for overall health and well-being", category: "Noodles", veg: true },
    { name: "Cooked Noodles", image: "food_32.png", price: 15, description: "Food provides essential nutrients for overall health and well-being", category: "Noodles", veg: true },
    { name: "Butter Chicken", image: "food_33.png", price: 28, description: "Classic creamy tomato curry with tender grilled chicken chunks.", category: "Indian", veg: false },
    { name: "Paneer Tikka Masala", image: "food_34.jpg", price: 22, description: "Grilled paneer cubes in a rich and spicy tomato-based gravy.", category: "Indian", veg: true },
    { name: "Dal Makhani", image: "food_35.jpg", price: 18, description: "Slow-cooked black lentils with butter and cream for a rich taste.", category: "Indian", veg: true },
    { name: "Chole Bhature", image: "food_36.jpg", price: 16, description: "Spicy chickpeas served with large deep-fried leavened bread.", category: "Indian", veg: true },
    { name: "Mutton Rogan Josh", image: "food_37.jpg", price: 32, description: "Tender mutton slow-cooked in a rich yogurt and herb gravy.", category: "Indian", veg: false },
    { name: "Coca Cola", image: "menu_10.png", price: 2, description: "Refreshing 500ml cold drink to accompany your meal.", category: "Beverages", veg: true },
    { name: "Pepsi", image: "menu_10.png", price: 2, description: "Classic 500ml pepsi for a perfect fizz.", category: "Beverages", veg: true },
    { name: "Sprite", image: "menu_10.png", price: 2, description: "Lemon-lime 500ml clear soda.", category: "Beverages", veg: true },
    { name: "Fresh Lime Soda", image: "menu_10.png", price: 3, description: "Zesty lime soda with a pinch of salt and sugar.", category: "Beverages", veg: true },
    { name: "Tandoori Roti", image: "menu_11.png", price: 1, description: "Whole wheat bread cooked in a traditional clay oven.", category: "Bread", veg: true },
    { name: "Butter Naan", image: "menu_11.png", price: 2, description: "Soft leavened bread with a generous glaze of butter.", category: "Bread", veg: true },
    { name: "Garlic Naan", image: "menu_11.png", price: 3, description: "Leavened bread topped with minced garlic and herbs.", category: "Bread", veg: true },
    { name: "Lachha Paratha", image: "menu_11.png", price: 2, description: "Multi-layered flaky whole wheat bread.", category: "Bread", veg: true }
];

const seedDatabase = async () => {
  try {
    const mongoURI = process.env.MONGO_URI || "mongodb://localhost:27017/khaanpaan"; 
    await mongoose.connect(mongoURI);
    console.log("Connected to MongoDB...");

    await foodModel.deleteMany({});
    console.log("Cleared existing food items.");

    await foodModel.insertMany(foodData);
    console.log("Successfully seeded database with food items!");

    process.exit();
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
};

seedDatabase();
