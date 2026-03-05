import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./config/mongodb.js";

import authRouter from "./routes/authRoutes.js";

import 'dotenv/config';

import familyRouter from "./routes/famRoutes.js";
import docRouter from "./routes/docRoutes.js";
const app = express();

const port =process.env.PORT||4000;

connectDB();

app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:5174", // ← add this (your frontend URL)
    credentials: true,
  }),
);

app.use(cookieParser())

app.use(express.urlencoded({ extended: true }));

app.use('/api/vault/auth',authRouter)
app.use('/api/vault',familyRouter)
app.use('/api/vault',docRouter)

app.listen(port,()=>{console.log(`server is listening on port no. ${port}`)})

app.get('/',(req,res)=>{
    return res.json({message:"Request body is required"})
})

