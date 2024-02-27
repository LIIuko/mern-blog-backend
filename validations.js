import { body } from "express-validator"

export const loginValidation = [
    body('email').isEmail().withMessage('Неверный формат почты'),
    body('password').isLength({min: 5}).withMessage('Минимальная длина пароля 5 символов'),
]

export const registerValidation = [
    body('email').isEmail().withMessage('Неверный формат почты'),
    body('password').isLength({min: 5}).withMessage('Минимальная длина пароля 5 символов'),
    body('fullname').isLength({min: 3}).withMessage('Минимальная длина имени 3 символа'),
    body('avatarUrl').optional().isURL().withMessage('Неверная ссылка не аватарку'),
]