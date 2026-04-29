import express from 'express'
import { loginUser, registerUser, getUserInfo } from '../controllers/userController.js'
import authMiddleware from '../middleware/auth.js';


const userRouter = express.Router();

userRouter.post("/register", registerUser)
userRouter.post("/login", loginUser)
userRouter.post("/info", authMiddleware, getUserInfo)

export default userRouter