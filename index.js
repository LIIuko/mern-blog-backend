import express from "express";
import mongoose from "mongoose";
import cors from 'cors';

import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 4444;

mongoose.connect(
    process.env.DB_CON
).then(() =>
    console.log("DB ok!")
).catch(err => {
    console.log("DB error ", err);
})

const app = express();

app.use(express.json());
app.use(cors());


app.listen(PORT, (err) => {
    if (err) {
        return console.log(err);
    }
    console.log("Server ok!")
})