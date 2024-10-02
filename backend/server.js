import express from "express";
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes.js';
import { connectToMongoDb } from "./mongodb/connectDb.js";

const app = express();
dotenv.config()

const PORT = process.env.PORT || 8000;

app.use(express.json());
app.use('/auth', authRoutes);
app.use('/messages', authRoutes);
app.use('/conversations', authRoutes);

app.listen(PORT, () =>{
    connectToMongoDb();
    console.log(`Server started at port ${PORT}`);
})

