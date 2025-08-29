import express from "express";
import { getUserProfile, loginUser, registerUser, updateUserProfile } from "../controller/userController.js";
import { protect } from "../middleware/authMiddleware.js";

const userRouter = express.Router()

userRouter.post('/register', registerUser)
userRouter.post('/login', loginUser)
userRouter.get('/profile', protect, getUserProfile)
userRouter.put('/update', protect, updateUserProfile)

export default userRouter;