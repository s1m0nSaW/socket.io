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
            const password = req.body.password;
            const salt = await bcrypt.genSalt(10);
            const hash = await bcrypt.hash(password, salt);

            const doc = new UserModel({
                email: req.body.email,
                nickname: req.body.nickname,
                fullname: req.body.fullname,
                age: req.body.age,
                gender: req.body.gender,
                date: req.body.date,
                passwordHash: hash,
                leader1: promoter._id,
                leader2: promoter.leader1,
                leader3: promoter.leader2,
                leader4: promoter.leader3,
                leader5: promoter.leader4,
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
        } else {
            const password = req.body.password;
            const salt = await bcrypt.genSalt(10);
            const hash = await bcrypt.hash(password, salt);

            const doc = new UserModel({
                email: req.body.email,
                date: req.body.date,
                fullname: req.body.fullname,
                age: req.body.age,
                gender: req.body.gender,
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
        }
        
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

export const isPartner = async (req, res) => {
    try {
        const user = await UserModel.findOneAndUpdate(
            {
                _id: req.userId,
            },
            {
                $set: {
                    partner: 'yes',
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

export const requisites = async (req, res) => {
    try {
        const user = await UserModel.findOneAndUpdate(
            {
                _id: req.userId,
            },
            {
                $set: {
                    requisites:{
                        userName:req.body.userName,
                        cardNumber:req.body.cardNumber,
                        inn: req.body.inn,
                        bankName: req.body.bankName,
                        bankNumber: req.body.bankNumber,
                        bankBik: req.body.bankBik,
                        bankCorNumber: req.body.bankCorNumber,
                    },
                },
            },
            { returnDocument: "after" }
        );

        if (user) {
            const { passwordHash, ...userData } = user._doc;

            res.json({
                ...userData
            });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Не удалось обновить данные",
        });
    }
};

export const updatePayment = async (req, res) => {
    try {
        const user = await UserModel.findOneAndUpdate(
            {
                _id: req.userId,
            },
            {
                $set: {
                    paymentId: req.body.paymentId,
                    paymentStatus: req.body.paymentStatus,
                },
            },
            { returnDocument: "after" }
        );

        if (user) {
            const { passwordHash, ...userData } = user._doc;

            res.json({
                ...userData
            });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Не удалось обновить",
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

export const payments = async (req, res) => {
    const data = req.body;
    if(data.object.status === "succeeded") {
        try {
            const user = await UserModel.findOneAndUpdate(
                {
                    paymentId: data.object.id,
                },
                {
                    $set: {
                        paymentStatus: data.object.status,
                    },
                },
                { returnDocument: "after" }
            );

            if(user.leader1 !== 'none'){
                await UserModel.findOneAndUpdate(
                    {
                        _id: user.leader1,
                    },
                    {
                        $push: {friends: user.id,
                            inviteds: {id:user._id, step:1, date: user.date}},
                        $inc: {balance: 500},
                    },
                    { returnDocument: "after" }
                );

                await UserModel.findOneAndUpdate(
                    {
                        _id: user._id,
                    },
                    {
                        $push: {friends: user.leader1},
                    },
                    { returnDocument: "after" }
                );
            }

            if(user.leader2 !== 'none'){
                    await UserModel.findOneAndUpdate(
                    {
                        _id: user.leader2,
                    },
                    {
                        $push: {
                            friends: user.id, 
                            inviteds: {id:user._id, step:2, date: user.date},
                        },
                        $inc: {balance: 200},
                    },
                    { returnDocument: "after" }
                );

                await UserModel.findOneAndUpdate(
                    {
                        _id: user._id,
                    },
                    {
                        $push: {friends: user.leader2},
                    },
                    { returnDocument: "after" }
                );
            }

            if(user.leader3 !== 'none'){
                await UserModel.findOneAndUpdate(
                    {
                        _id: user.leader3,
                    },
                    {
                        $push: {friends: user.id,
                            inviteds: {id:user._id, step:3, date: user.date}},
                        $inc: {balance: 100},
                    },
                    { returnDocument: "after" }
                );

                await UserModel.findOneAndUpdate(
                    {
                        _id: user._id,
                    },
                    {
                        $push: {friends: user.leader3},
                    },
                    { returnDocument: "after" }
                );
            }

            if(user.leader4 !== 'none'){
                await UserModel.findOneAndUpdate(
                    {
                        _id: user.leader4,
                    },
                    {
                        $push: {friends: user.id,
                            inviteds: {id:user._id, step:4, date: user.date}},
                        $inc: {balance: 100},
                    },
                    { returnDocument: "after" }
                );

                await UserModel.findOneAndUpdate(
                    {
                        _id: user._id,
                    },
                    {
                        $push: {friends: user.leader4},
                    },
                    { returnDocument: "after" }
                );
            }

            if(user.leader5 !== 'none'){
                await UserModel.findOneAndUpdate(
                    {
                        _id: user.leader5,
                    },
                    {
                        $push: {friends: user.id,
                            inviteds: {id:user._id, step:5, date: user.date}},
                        $inc: {balance: 100},
                    },
                    { returnDocument: "after" }
                );

                await UserModel.findOneAndUpdate(
                    {
                        _id: user._id,
                    },
                    {
                        $push: {friends: user.leader5},
                    },
                    { returnDocument: "after" }
                );
            }

            res.sendStatus(200);

        } catch (error) {
            console.log(error);
            res.sendStatus(500);
        }
    } else {
        try {
            await UserModel.findOneAndUpdate(
                {
                    paymentId: data.object.id,
                },
                {
                    $set: {
                        status: data.object.status,
                    },
                },
                { returnDocument: "after" }
            );
            res.sendStatus(200);
        } catch (error) {
            console.log(error);
            res.sendStatus(500);
        }
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
            email, 
            cardNumber, 
            balance, 
            paymentId, 
            paymentStatus,
            date,
            leader1,
            leader2,
            leader3,
            leader4,
            leader5,
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

export const upgrade = async (req, res) => {
    try {
        const subject = await UserModel.findOneAndUpdate(
            {
                _id: req.params.id,
            },{$set:{
                date: req.body.date,
                paymentStatus: req.body.status,
            }},{ returnDocument: "after" });

            if(subject){res.json(subject);}
            
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Проблема с удалением",
        });
    }
};