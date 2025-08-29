import express from "express";

import { getUserProfile, loginUser, registerUser } from "../controller/userController.js";
import { protect } from "../middleware/authMiddleware.js";
import { createResume, deleteResume, getResumeById, getUserResume, updateResume, getResumePdf } from "../controller/resumeController.js";
import { uploadResumeImages } from "../controller/uploadImages.js";
const resumeRouter = express.Router()


resumeRouter.post('/' , protect , createResume );
resumeRouter.get('/' , protect , getUserResume);
resumeRouter.get('/:id' , protect , getResumeById);
resumeRouter.put('/:id' , protect , updateResume);
resumeRouter.put('/:id/upload-images' , protect , uploadResumeImages);

resumeRouter.delete('/:id', protect ,deleteResume)

resumeRouter.get('/:id/pdf', protect, getResumePdf)

export default resumeRouter;