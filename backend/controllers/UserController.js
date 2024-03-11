import jwt from "jsonwebtoken";
import dotenv from "dotenv";

import UserModel from "../models/User.js";

dotenv.config();

const secret = process.env.SKEY;

export const register = async (req, res) => {
    try {
        const doc = new UserModel({
            vkid: req.body.vkid,
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
        const date = +new Date();
        const tokenDate = date+2160000000
    
        res.status(200).json({user, token, tokenDate});
        
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Не удалoсь зарегистрироваться",
        });
    }
};

export const getToken = async (req, res) => {
    try {
        const user = await UserModel.findOne({ vkid: req.body.vkid });

        const date = +new Date();

        if (!user) {
            return res.status(404).json({
                message: "Пользователь не найден",
            });
        }

        if(date > user.statusDate) {
            user.status = 'none';
            user.statusDate = 0;
            await user.save();
        
            const token = jwt.sign(
                {
                    _id: user._id,
                },
                secret,
                {
                    expiresIn: "30d",
                }
            );
            const tokenDate = date+2160000000
        
            res.status(200).json({user, token, tokenDate});
        } else {
        
            const token = jwt.sign(
                {
                    _id: user._id,
                },
                secret,
                {
                    expiresIn: "30d",
                }
            );
            const tokenDate = date+2160000000
            res.status(200).json({user, token, tokenDate});
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Нет доступа",
        });
    }
};

export const getMe = async (req, res) => {
    try {
        const user = await UserModel.findOne({ vkid: req.body.vkid });

        const date = +new Date();

        if (!user) {
            return res.status(404).json({
                message: "Пользователь не найден",
            });
        }

        if(date > user.statusDate) {
            user.status = 'none';
            user.statusDate = 0;
            await user.save();
        
            res.status(200).json(user);
        } else {
        
            res.status(200).json(user);
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Нет доступа",
        });
    }
};

export const getAll = async (req, res) => {
    try {
        const users = await UserModel.find();

        res.status(200).json(users);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Нет доступа",
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

                res.status(200).json({
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

export const updateRsvpDate = async (req, res) => {
    try {
        const user = await UserModel.findById(req.body.vkid);
        if (user.status === 'sponsor') {
            user.dailyRsvp = 10;
        } else if (user.status === 'promoter') {
            user.dailyRsvp = 3;
        } else if (user.status === 'none') {
            user.dailyRsvp = 1;
        }
        user.rsvpDate = req.body.rsvpDate;
        user.rsvpStatus = false;
        await user.save();
        res.sendStatus(200);

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Не удалось обновить данные",
        });
    }
};

export const updateRsvpStatus = async (req, res) => {
    try {
        const user = await UserModel.findOneAndUpdate(
            {
                _id: req.body.vkid
            },
            {
                $set: {
                    rsvpStatus: true,
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

export const updateSponsor = async (req, res) => {
    try {
        const user = await UserModel.findOneAndUpdate(
            {
                _id: req.body.vkid
            },
            {
                $set: {
                    status: 'sponsor',
                    statusDate: +new Date() + 2592000000,
                },
            },
            { returnDocument: "after" }
        );

        res.status(200).json(user);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Проблема с удалением",
        });
    }
};