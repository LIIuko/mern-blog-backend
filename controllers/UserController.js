import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import UserModel from "../models/User.js"


import dotenv from 'dotenv';
dotenv.config();

export const register = async (req, res) => {
    try {
        const password = req.body.password;
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        const doc = new UserModel({
            email: req.body.email,
            fullName: req.body.fullName,
            passwordHash: hash,
            avatarUrl: `https://traaaaaaader-blog-api.onrender.com/${req.body.avatarUrl}`,
        })

        const user = await doc.save();

        const token = jwt.sign(
            {
                _id: user._id
            },
            process.env.SECRET_KEY,
            {
                expiresIn: '30d'
            }
        )

        const { passwordHash, ...userData } = user._doc;

        res.json({
            ...userData,
            token
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось зарегистрироваться'
        });
    }

}

export const login = async (req, res) => {
    try {
        const user = await UserModel.findOne({ email: req.body.email });

        if (!user) {
            return res.status(404).json({
                message: 'Пользователь не найден'
            })
        }

        const isValidPass = await bcrypt.compare(req.body.password, user.passwordHash);

        if (!isValidPass) {
            return res.status(404).json({
                message: 'Неверный логин или пароль'
            })
        }

        const token = jwt.sign(
            {
                _id: user._id
            },
            process.env.SECRET_KEY,
            {
                expiresIn: '30d'
            }
        )

        const { passwordHash, ...userData } = user._doc;

        res.json({
            ...userData,
            token
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось авторизоваться'
        });
    }
}

export const getMe = async (req, res) => {
    try {
        const user = await UserModel.findById(req.userId);

        if(!user){
            return res.status(404).json({
                message: 'Пользователь не найден',
            })
        }

        const { passwordHash, ...userData } = user._doc;

        res.json(
            userData
        );

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Нет доступа'
        });
    }
}

export const getUser = async (req, res) => {
    try {
        const user = await UserModel.findById(req.params.id);

        if(!user){
            return res.status(404).json({
                message: 'Пользователь не найден',
            })
        }

        const { passwordHash, email, createdAt, updatedAt, ...userData } = user._doc;

        res.json(
            userData
        );

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Нет доступа'
        });
    }
}