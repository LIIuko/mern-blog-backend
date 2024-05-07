import PostModel from '../models/Post.js'
import CommentModel from '../models/Comment.js'

import dotenv from 'dotenv';

dotenv.config();

export const getTags = async (req, res) => {
    try {
        const posts = await PostModel.find().limit(100).exec();
        const tags = Array.from(new Set(posts.map(obj => obj.tags).flat())).slice(0, 5);

        res.json(tags);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось получить теги'
        });
    }
}

export const getAll = async (req, res) => {
    try {
        const posts = await PostModel.find()
            .populate({
                path: "user",
                select: ["fullName", "avatarUrl"]
            })
            .populate({
                path: "comments",
                select: ["text", "user"]
            })
            .exec();

        res.json(posts);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось получить статьи'
        });
    }
}

export const getOne = async (req, res) => {
    try {
        const postId = req.params.id;

        PostModel.findOneAndUpdate({
            _id: postId
        }, {
            $inc: {viewsCount: 1}
        }, {
            returnDocument: 'after'
        })
        .populate({
            path: "user",
            select: ["fullName", "avatarUrl"]
        })
        .populate({
        path: "comments",
        select: ["text", "user"],
        populate: {
            path: "user",
            select: "fullName avatarUrl" // Загрузка имени и аватара пользователя комментария
        }
        })
        .exec()
        .then((doc, err) => {
            if (err) {
                console.log(err);
                return res.status(500).json({
                    message: 'Не удалось получить статью'
                });
            }

            if (!doc) {
                return res.status(404).json({
                    message: 'Статья не найдена'
                });
            }

            res.json(doc);
        })
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось получить статью'
        });
    }
}

export const remove = async (req, res) => {
    try {
        const postId = req.params.id;

        PostModel.findOneAndDelete({
            _id: postId
        }).then((doc, err) => {
            if (err) {
                console.log(err);
                return res.status(500).json({
                    message: 'Не удалось удалить статью'
                });
            }

            if (!doc) {
                return res.status(404).json({
                    message: 'Статья не найдена'
                });
            }

            res.json({
                success: true
            })
        })

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось получить статью'
        });
    }
}

export const update = async (req, res) => {
    try {
        const postId = req.params.id;

        PostModel.updateOne({
            _id: postId
        }, {
            title: req.body.title,
            text: req.body.text,
            tags: req.body.tags,
            imageUrl: req.body.imageUrl,
            user: req.userId,
        }).then((doc, err) => {
            if (err) {
                console.log(err);
                return res.status(500).json({
                    message: 'Не удалось обновить статью'
                });
            }

            if (!doc) {
                return res.status(404).json({
                    message: 'Статья не найдена'
                });
            }

            res.json({
                success: true
            })
        })
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось обновить статью'
        });
    }
}

export const create = async (req, res) => {
    try {
        const doc = new PostModel({
            title: req.body.title,
            text: req.body.text,
            tags: req.body.tags,
            imageUrl: req.body.imageUrl,
            user: req.userId,
        });

        const post = await doc.save();

        res.json(post);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось создать статью'
        });
    }
}

export const addComment = async (req, res) => {
    const postId = req.params.id; // ID поста, к которому добавляется комментарий
    const userId = req.userId; // Предполагаем, что userId берётся из токена аутентификации (например, JWT)

    try {
        // Создание нового комментария
        const comment = new CommentModel({
            text: req.body.text,
            user: userId
        });

        // Сохранение комментария в базе данных
        await comment.save();

        // Добавление комментария к посту
        await PostModel.findByIdAndUpdate(postId, {
            $push: {comments: comment._id}
        });

        res.status(201).json({
            success: true,
            commentId: comment._id,
            message: 'Комментарий успешно добавлен'
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Не удалось добавить комментарий'
        });
    }
}