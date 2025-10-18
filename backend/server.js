import express from "express";
import cors from "cors";
import dotenv from "dotenv/config"
import Router from "./routes/pages-routes.js";


const app = express();
const PORT = 4000;

// await connectToDB();

app.use(express.json());
app.use(cors());
// app.use('/api/fetch',showRouter)

app.use('/Animestream',Router);

app.listen(PORT,()=>{
    console.log("server is listening!!");
})
