import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

import UserModel from "../models/User.js";

dotenv.config();

const secret = process.env.SECRET;

export const register = async (req, res) => {
    try {
        const promoter = await UserModel.findOne({ nickname: req.body.promoter });
        if(promoter){
            
        }

        const password = req.body.password;
            const salt = await bcrypt.genSalt(10);
            const hash = await bcrypt.hash(password, salt);

            const doc = new UserModel({
                email: req.body.email,
                nickname: req.body.nickname,
                passwordHash: hash,
            });

            const user = await doc.save();

            const token = jwt.sign(
                {
                    _id: user._id,
                },
                secret,
                {
                    expiresIn: "30d",
                }
            );

            const { passwordHash, ...userData } = user._doc;

            res.json({
                ...userData,
                token,
            });
        
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Не удалoсь зарегистрироваться",
        });
    }
};

export const login = async (req, res) => {
    try {
        const user = await UserModel.findOne({ email: req.body.email });

        if (!user) {
            return res.status(400).json({
                message: "Неверный логин или пароль",
            });
        }

        const isValidPass = await bcrypt.compare(
            req.body.password,
            user._doc.passwordHash
        );

        if (!isValidPass) {
            return res.status(400).json({
                message: "Неверный логин или пароль",
            });
        }

        const token = jwt.sign(
            {
                _id: user._id,
            },
            secret,
            {
                expiresIn: "30d",
            }
        );

        const { passwordHash, ...userData } = user._doc;

        res.json({
            ...userData,
            token,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Не удалось авторизоваться",
        });
    }
};

export const updateNick = async (req, res) => {
    try {
        const nick = await UserModel.findOne({ nickname: req.body.nickname });
        if(nick){
            res.status(500).json({
                message: "Пользователь с таким ником уже существует",
            });
        } else {
            const user = await UserModel.findOneAndUpdate(
                {
                    _id: req.userId,
                },
                {
                    $set: {
                        nickname: req.body.nickname,
                    },
                },
                { returnDocument: "after" }
            );
            if(user){res.sendStatus(200);}
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Не удалось обновить данные",
        });
    }
};

export const updateEmail = async (req, res) => {
    try {
        const email = await UserModel.findOne({ email: req.body.email });
            if(email){
                res.status(500).json({
                    message: "Пользователь с таким e-mail уже существует",
                });
            } else {
                const user = await UserModel.findOneAndUpdate(
                    {
                        _id: req.userId,
                    },
                    {
                        $set: {
                            email: req.body.email,
                        },
                    },
                    { returnDocument: "after" }
                );
                if(user){res.sendStatus(200);}
            }
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Не удалось обновить данные",
        });
    }
};

export const updatePassword = async (req, res) => {
    try {
        const password = req.body.password;
            const salt = await bcrypt.genSalt(10);
            const hash = await bcrypt.hash(password, salt);

            const user = await UserModel.findOneAndUpdate(
                {
                    _id: req.userId,
                },
                {
                    $set: {
                        passwordHash: hash,
                    },
                },
                { returnDocument: "after" }
            );
            if(user){res.sendStatus(200);}
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Не удалось обновить данные",
        });
    }
};

export const getMe = async (req, res) => {
    try {
        const user = await UserModel.findById(req.userId);

        if (!user) {
            return res.status(404).json({
                message: "Пользователь не найден",
            });
        }
        const { passwordHash, ...userData } = user._doc;

        res.json(userData);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Нет доступа",
        });
    }
};

export const getUser = async (req, res) => {
    try {
        const user = await UserModel.findOne({ nickname: req.params.name, });

        if (!user) {
            return res.status(404).json({
                message: "Пользователь не найден",
            });
        }
        const { 
            passwordHash,
            ...userData } = user._doc;

        res.json(userData);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Нет доступа",
        });
    }
};

export const checkUser = async (req, res) => {
    try {
        const email = await UserModel.findOne({ email: req.body.email });
        const nick = await UserModel.findOne({ nickname: req.body.nickname });
        const promoter = await UserModel.findOne({ nickname: req.body.promoter });

        const data = {
            email: Boolean(email), 
            nickname: Boolean(nick),
            promoter: Boolean(promoter)
        }

        res.json(data);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Нет доступа",
        });
    }
};

export const getAll = async (req, res) => {
    try {
        const users = await UserModel.find().exec();
        res.json(users);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Не удалось найти",
        });
    }
};

export const remove = async (req, res) => {
    try {
        UserModel.findOneAndDelete(
            {
                _id: req.params.id,
            },
            (err, doc) => {
                if (err) {
                    console.log(err);
                    return res.status(500).json({
                        message: "Не удалось удалить",
                    });
                }

                if (!doc) {
                    return res.status(404).json({
                        message: "Пользователь не найден",
                    });
                }

                res.json({
                    success: true,
                });
            }
        );
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Проблема с удалением",
        });
    }
};

export const update = async (req, res) => {
    try {
        const user = await UserModel.findOneAndUpdate(
            {
                _id: req.params.id,
            },
            {
                $set: {
                    fullname: req.body.fullname,
                    age: req.body.age,
                    gender: req.body.gender,
                    city: req.body.city,
                },
            },
            { returnDocument: "after" }
        );

        res.json(user);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Проблема с удалением",
        });
    }
};