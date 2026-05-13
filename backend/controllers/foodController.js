import foodModel from "../models/foodModel.js";
import fs from 'fs'

//add food item

const addFood = async(req, res) => {
    try {
        // Read the image file and convert to Base64
        const filePath = `uploads/${req.file.filename}`;
        const imageBuffer = fs.readFileSync(filePath);
        const base64Image = `data:${req.file.mimetype};base64,${imageBuffer.toString('base64')}`;

        const food = new foodModel({
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            category: req.body.category,
            image: base64Image, // Store Base64 string instead of filename
            veg: req.body.veg === "true" || req.body.veg === true,
            inStock: true
        }) 

        await food.save();

        // Delete the temporary file from 'uploads' folder
        fs.unlink(filePath, (err) => {
            if (err) console.log("Error deleting temp file:", err);
        });

        res.json({
            success: true, 
            message: "Food Added Successfully (Stored Permanently)",
        })
    }
    catch(error){
        console.log(error);
        res.json({
            success: false,
            message: "Error adding food item",
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

const updateFood = async (req, res) => {
    try {
        const { id, name, description, price, category, veg } = req.body;
        let updateData = {
            name,
            description,
            price: Number(price),
            category,
            veg: veg === "true" || veg === true
        };

        // Handle image update if a new file is uploaded
        if (req.file) {
            const filePath = `uploads/${req.file.filename}`;
            const imageBuffer = fs.readFileSync(filePath);
            const base64Image = `data:${req.file.mimetype};base64,${imageBuffer.toString('base64')}`;
            updateData.image = base64Image;

            // Delete temporary file
            fs.unlink(filePath, (err) => {
                if (err) console.log("Error deleting temp file:", err);
            });
        }

        await foodModel.findByIdAndUpdate(id, updateData);
        res.json({ success: true, message: "Product Updated Successfully" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error updating product" });
    }
}

export {addFood, listFood, removeFood, toggleStock, updateFood}