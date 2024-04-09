import { body } from "express-validator"

export const loginValidation = [
    body('email').isEmail().withMessage('Неверный формат почты'),
    body('password').isLength({min: 5}).withMessage('Минимальная длина пароля 5 символов'),
]

export const registerValidation = [
    body('email').isEmail().withMessage('Неверный формат почты'),
    body('password').isLength({min: 5}).withMessage('Минимальная длина пароля 5 символов'),
    body('fullName').isLength({min: 3}).withMessage('Минимальная длина имени 3 символа'),
    body('avatarUrl').optional().isURL().withMessage('Неверная ссылка не аватарку'),
]

export const postCreateValidation = [
    body('title').isLength({min: 1}).withMessage('введите заголов статьи'),
    body('text').isLength({min: 10}).withMessage('Введите текст статьи'),
    body('tags').optional().isArray().withMessage('Неверный формат тэгов (укажите массив)'),
    body('imageUrl').optional().isURL().withMessage('Неверная ссылка не изображение'),
]