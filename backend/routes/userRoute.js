import express from 'express'
import { loginUser, registerUser, getUserInfo, phoneLogin, sendOtp, verifyOtp, updateUserInfo, googleLogin, listUsers } from '../controllers/userController.js'
import authMiddleware from '../middleware/auth.js';
import multer from 'multer';
import dotenv from 'dotenv';
dotenv.config();

const userRouter = express.Router();

// Disk Storage Engine
const storage = multer.diskStorage({
    destination: "uploads",
    filename: (req, file, cb) => {
        return cb(null, `${Date.now()}_${file.originalname}`);
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