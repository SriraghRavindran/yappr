import mongoose, { mongo } from "mongoose";

export const connectToMongoDb = async()=>{
    try{
        await mongoose.connect(process.env.MONGO_DB_URI);
        console.log('Connected to MongoDB');
    }
    catch(error){
        console.log('Error occured while connecting to DB', error.message);
    }
}