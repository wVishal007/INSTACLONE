import mongoose from "mongoose";
import dotenv from 'dotenv';
dotenv.config({});
// console.log(process.env.MONGO_URI)
const db_URI = process.env.MONGO_URI;
const connectDB = async () => {   
    try{
        console.log("Connecting to database");
     await mongoose.connect(db_URI);
    //  await mongoose.connect("mongodb://localhost:27017/instaclone");
       console.log("Connected to database");
    } catch (error){
        console.log("Error connecting to database")
    }
};

export default connectDB;