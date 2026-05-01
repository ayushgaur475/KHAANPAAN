import express from 'express'
import { loginUser, registerUser, getUserInfo, phoneLogin, sendOtp, verifyOtp, updateUserInfo } from '../controllers/userController.js'
import authMiddleware from '../middleware/auth.js';
import multer from 'multer';

const userRouter = express.Router();

import { storage } from "../config/cloudinary.js";

const upload = multer({ storage: storage });

userRouter.post("/register", registerUser)
userRouter.post("/login", loginUser)
userRouter.post("/phone-login", phoneLogin)
userRouter.post("/send-otp", sendOtp)
userRouter.post("/verify-otp", verifyOtp)
userRouter.post("/info", authMiddleware, getUserInfo)
userRouter.post("/update", authMiddleware, upload.single("image"), updateUserInfo)
export default userRouter