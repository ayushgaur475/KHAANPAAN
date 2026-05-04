import express from "express";
import { addFood , listFood, removeFood, toggleStock} from "../controllers/foodController.js";
import multer from 'multer';
import adminAuth from "../middleware/adminAuth.js";
import dotenv from 'dotenv';
dotenv.config();

const foodRouter = express.Router();

// Disk Storage Engine
const storage = multer.diskStorage({
    destination: "uploads",
    filename: (req, file, cb) => {
        return cb(null, `${Date.now()}_${file.originalname}`);
    }
});

const upload = multer({ storage });

foodRouter.post("/add", adminAuth, upload.single("image"), addFood);
foodRouter.get("/list",listFood)
foodRouter.post("/remove", adminAuth, removeFood);
foodRouter.post("/toggle-stock", adminAuth, toggleStock);

export default foodRouter;