import express from 'express'
import { loginUser, registerUser, getUserInfo, phoneLogin, sendOtp, verifyOtp, updateUserInfo, googleLogin, listUsers } from '../controllers/userController.js'
import authMiddleware from '../middleware/auth.js';
import multer from 'multer';
import { GridFsStorage } from 'multer-gridfs-storage';
import dotenv from 'dotenv';
dotenv.config();

const userRouter = express.Router();

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

userRouter.post("/register", registerUser)
userRouter.post("/login", loginUser)
userRouter.post("/phone-login", phoneLogin)
userRouter.post("/send-otp", sendOtp)
userRouter.post("/verify-otp", verifyOtp)
userRouter.post("/info", authMiddleware, getUserInfo)
userRouter.post("/update", authMiddleware, upload.single("image"), updateUserInfo)
userRouter.post("/google-login", googleLogin)
userRouter.get("/list-users", listUsers)

export default userRouter