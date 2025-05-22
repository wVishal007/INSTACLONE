import dotenv from 'dotenv';
dotenv.config({});
import express, { urlencoded } from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import connectDB from './utils/db.js';
import userRoute from './routes/user.route.js'
import messageRoute from './routes/message.route.js'
import postRoute from './routes/post.route.js'
import { app,server } from './socket/socket.js';
import path from 'path'


const __dirname = path.resolve()


const PORT = process.env.port || 3000;



import cookieParser from 'cookie-parser';

// const app = express();
// app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(urlencoded({ extended: true }));



const corsOptions = {
  origin: process.env.FRONT_URL,
  credentials: true,
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));



//api incoming
app.use('/api/v1/user' ,userRoute);
app.use('/api/v1/message' ,messageRoute);
app.use('/api/v1/post' ,postRoute);

app.use(express.static(path.join(__dirname,'/client/dist')))
app.get('*',(req,res)=>{
  res.sendFile(path.resolve(__dirname,'client','dist','index.html'))
})

server.listen(PORT, () => {
  connectDB();
  console.log(`Server is running on port ${PORT}`);
});