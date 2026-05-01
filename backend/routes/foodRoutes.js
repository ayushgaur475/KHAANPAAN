import express from "express";
import { addFood , listFood, removeFood, toggleStock} from "../controllers/foodController.js";
import multer from 'multer';
import { GridFsStorage } from 'multer-gridfs-storage';
import adminAuth from "../middleware/adminAuth.js";
import dotenv from 'dotenv';
dotenv.config();

const foodRouter = express.Router();

// GridFS Storage Engine
const storage = new GridFsStorage({
    url: process.env.MONGO_URI,
    file: (req, file) => {
        return {
            filename: `${Date.now()}_${file.originalname}`,
            bucketName: 'uploads'
        };
    }
});

const upload = multer({ storage });

foodRouter.post("/add", adminAuth, upload.single("image"), addFood);
foodRouter.get("/list",listFood)
foodRouter.post("/remove", adminAuth, removeFood);
foodRouter.post("/toggle-stock", adminAuth, toggleStock);

export default foodRouter;