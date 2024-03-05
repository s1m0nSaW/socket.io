import UserModel from "../models/User.js";

export const register = async (req, res) => {
    try {
        const doc = new UserModel({
            vkid: req.body.vkid,
        });
    
        const user = await doc.save();
    
        res.json(user);
        
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Не удалoсь зарегистрироваться",
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
            res.json(user);
        } else {
            res.json(user);
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

        res.json(users);
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
                _id: req.body.vkid,
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

        res.json(user);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Проблема с удалением",
        });
    }
};