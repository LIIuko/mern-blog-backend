import express from "express";
import cors from 'cors';

import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 4444;

const app = express();

app.use(express.json());
app.use(cors());


app.listen(PORT, (err) => {
    if (err) {
        return console.log(err);
    }
    console.log("Server ok!")
})