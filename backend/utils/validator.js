import { body } from "express-validator";

export const registerValidator = [
    body('email','Неверный формат почты').isEmail(),
    body('password','Пароль должен быть минимум 5 символов').isLength({ min: 5}),
    body('promoter','Никнейм пригласившего должен быть минимум 5 символов').isLength({ min: 5, max: 10}),
]

export const emailValidator = [
    body('email','Неверный формат почты').isEmail(),
]

export const nicknameValidator = [
    body('nickname','Никнейм пригласившего должен быть минимум 5 символов').isLength({ min: 5, max: 10}),
]

export const passwordValidator = [
    body('password','Пароль должен быть минимум 5 символов').isLength({ min: 5}),
]

export const loginValidator = [
    body('email','Неверный формат почты').isEmail(),
    body('password','Ошибка').isString(),
]