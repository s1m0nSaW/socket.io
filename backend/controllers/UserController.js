import jwt from "jsonwebtoken";
import dotenv from "dotenv";

import UserModel from "../models/User.js";

dotenv.config();

const secret = process.env.SKEY;

export const register = async (req, res) => {
    try {
        
        const doc = new UserModel({
            vkid: req.body.vkid,
            status: req.body.status
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

        if(user.status !== 'none'){
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
        } else {
            if(date > user.rsvpDate){
                user.rsvpStatus = true;
            }
            if(date > user.adsDate){
                user.adsStatus = true;
            }
            if(req.body.change === true){
                user.status = 'none'
            }
            if(user.status === 'none'){
                if(req.body.promoter === true){
                    user.status = 'promoter';
                    user.dailyRsvp = 3;
                }
            }
    
            if(date > user.statusDate) {
                if(user.status === 'sponsor'){
                    user.status = 'none';
                    user.statusDate = 0;
                    user.dailyRsvp = 1;
                }
                await user.save();
            
                res.status(200).json(user);
            } else {
            
                res.status(200).json(user);
            }
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

export const afterAds = async (req, res) => {
    const date = +new Date()
    try {
        const user = await UserModel.findById(req.userId);
        if(user.ads >= 2){
            res.status(500);
        } else {
            user.rsvp += 1;
            user.ads += 1;
            if (user.ads === 2){
                user.adsDate = date + 86400000;
                user.adsStatus = false;
            }
            await user.save();
            res.status(200);
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Не удалось обновить данные",
        });
    }
};

export const updateRsvpDate = async (req, res) => {
    const date = +new Date()
    try {
        const user = await UserModel.findById(req.userId);
        if(user.rsvpStatus === true){
            if (user.status === 'sponsor') {
                user.rsvp += 10;
            } else if (user.status === 'promoter') {
                user.rsvp += 3;
            } else if (user.status === 'none') {
                user.rsvp += 1;
            }
            user.rsvpDate = date + 86400000;
            user.rsvpStatus = false;
            await user.save();
            res.status(200);
        } else {
            res.status(200);
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Не удалось обновить данные",
        });
    }
};

export const updateRsvpStatus = async (req, res) => {
    try {
        const date = +new Date();
        const user = await UserModel.findById(req.userId);
        if(date > user.rsvpDate){
            user.rsvpStatus = true;
            await user.save();
            res.status(200);
        } else {
            res.status(200);
        }

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
                vkid: req.body.vkid
            },
            {
                $set: {
                    status: 'sponsor',
                    statusDate: +new Date() + 2592000000,
                    dailyRsvp: 10
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