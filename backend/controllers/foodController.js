import foodModel from "../models/foodModel.js";
import fs from 'fs'

//add food item

const addFood = async(req, res) => {
    
    let image_filename = `${req.file.path}`;
    const food = new foodModel({
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        category: req.body.category,
        image: image_filename,
        veg: req.body.veg === "true" || req.body.veg === true,
        inStock: true
    }) 
    try{
        await food.save();
        res.json({
            success: true, 
            message: "Food Added",
        })
    }
    catch(error){
        console.log("error");
        res.json({
            success: false,
            message: "Error",
        })
    }
}
//all food list

const listFood = async(req, res) => {
     try{
        const foods = await foodModel.find({});
        res.json({
            success:true,
            data:foods
        })
     }catch(error){
        console.log(error);
        res.json({
            success:false,
            message:"Error"
        })
     }
}

// remove food items

const removeFood = async (req, res) => {
    try{
        const food = await foodModel.findById(req.body.id);
        await foodModel.findByIdAndDelete(req.body.id); // to delete from database
        res.json({
            success: true,
            message:"Food Removed"
        })
    }catch(error){
        console.log(error);
        res.json({
            success:false,
            message:"Error"
        })
    }
}
const toggleStock = async (req, res) => {
    try {
        const food = await foodModel.findById(req.body.id);
        food.inStock = !food.inStock;
        await food.save();
        res.json({
            success: true,
            message: "Stock Status Updated",
            inStock: food.inStock
        })
    } catch (error) {
        console.log(error);
        res.json({
            success: false,
            message: "Error updating stock status"
        })
    }
}

export {addFood, listFood, removeFood, toggleStock}