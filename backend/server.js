import express from "express";
import cors from "cors";
import dotenv from "dotenv/config"
import Router from "./routes/pages-routes.js";

import mongoose from "mongoose";

const app = express();
const PORT = 4000;

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error("MongoDB connection error:", err));

app.use(express.json());
app.use(cors());
// app.use('/api/fetch',showRouter)

app.use('/Animestream',Router);

app.listen(PORT,()=>{
    console.log("server is listening!!");
})
