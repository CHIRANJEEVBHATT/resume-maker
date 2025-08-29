import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from "./config/db.js";
import userRouter from './routes/userRoutes.js';
import path from 'path'
import { fileURLToPath } from 'url';
import resumeRouter from './routes/resumeRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename)
const app = express();
const PORT = parseInt(process.env.PORT || '4000', 10);

app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173', credentials: true }))
connectDB()

app.use(express.json())

app.use('/api/auth' , userRouter)
app.use('/api/resume' , resumeRouter)

// Removed static serving of uploads since image upload feature is removed

app.get('/' , (req,res)=>{
    res.send('api working');
})

app.listen(PORT , () =>{
    console.log('server started')
})