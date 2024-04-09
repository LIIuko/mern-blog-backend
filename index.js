import express from "express";
import multer from "multer";
import mongoose from "mongoose";
import cors from 'cors';

import { registerValidation, loginValidation, postCreateValidation } from "./validations.js";

import { checkAuth, handleValidationErrors } from "./utils/index.js";
import { UserController, PostController } from './controllers/index.js';

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


const storage = multer.diskStorage({
    destination: (_, __, cb) => {
        cb(null, 'uploads');
    },
    filename: (_, file, cb) => {
        cb(null, file.originalname);
    },
});


const upload = multer({ storage });


app.use(express.json());
app.use(cors());
app.use('/uploads', express.static('uploads'));


app.post('/auth/registration', registerValidation, handleValidationErrors, UserController.register)
app.post('/auth/login', loginValidation, handleValidationErrors, UserController.login)
app.get('/auth/me', checkAuth, UserController.getMe)


app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
    res.json({
        url: `/uploads/${req.file.originalname}`,
    })
})


app.get('/posts', PostController.getAll)
app.get('/tags', PostController.getTags)
app.get('/posts/:id', PostController.getOne)
app.post('/posts', checkAuth, postCreateValidation, handleValidationErrors, PostController.create)
app.delete('/posts/:id', checkAuth, PostController.remove)
app.patch('/posts/:id', checkAuth, postCreateValidation, handleValidationErrors, PostController.update)


app.listen(PORT, (err) => {
    if (err) {
        return console.log(err);
    }
    console.log("Server ok!")
})