import express from "express";
import { addFood , listFood, removeFood, toggleStock} from "../controllers/foodController.js";
import multer from 'multer';
import adminAuth from "../middleware/adminAuth.js";

const foodRouter = express.Router();

import { storage } from "../config/cloudinary.js";

const upload = multer({ storage: storage });

foodRouter.post("/add", adminAuth, upload.single("image"), addFood);
foodRouter.get("/list",listFood)
foodRouter.post("/remove", adminAuth, removeFood);
foodRouter.post("/toggle-stock", adminAuth, toggleStock);

export default foodRouter;