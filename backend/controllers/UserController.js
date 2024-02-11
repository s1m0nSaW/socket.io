import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import sharp from 'sharp';
import fs from 'fs';

import UserModel from "../models/User.js";
import StatModel from "../models/Stat.js";

dotenv.config();

const secret = process.env.SECRET;

const updateStat = async (user_id) => {
    const today = new Date(); // Получаем текущую дату
    today.setHours(0, 0, 0, 0); // Устанавливаем время в полночь
    StatModel.findOne({ date: today }, (err, stat) => {
        if (err) {
            console.error('Ошибка при поиске статистики:', err);
        } else {
            if (stat) {
                // Нашли объект статистики для сегодняшней даты
                // Теперь мы можем вносить изменения
                stat.newUsers.push(user_id); // Добавляем новую строку в массив strings
                // stat.numbers.push(42); // Добавляем число 42 в массив numbers

                // Сохраняем изменения в базе данных
                stat.save();
            } else {
                // Объект статистики для сегодняшней даты не найден, создаем новый объект статистики
                const newStatistic = new StatModel({
                    date: today,
                    newUsers: [user_id],
                    // numbers: [42],
                });

                // Сохраняем новый объект статистики в базе данных
                newStatistic.save();
            }
        }
    });
}

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
                rsvp: 5,
                passwordHash: hash,
                friends: [promoter._id],
                promoter: promoter.nickname,
            });

            const user = await doc.save();
            updateStat(promoter._id);

            promoter.friends.push(user._id);
            promoter.rsvp += 5;
            promoter.invited += 1;

            if(promoter.invited === 10){
                if (promoter.status === 'sponsor') {
                    promoter.statusDate += 2592000000;
                    promoter.invited = 0;
                } else if (user.status === 'none') {
                    promoter.status = 'sponsor';
                    promoter.statusDate = +new Date() + 2592000000;
                    promoter.invited = 0;
                }
            }

            await promoter.save();

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
                nickname: req.body.nickname,
                passwordHash: hash,
            });

            const user = await doc.save();
            updateStat('none');

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
            const { passwordHash, ...userData } = user._doc;
            res.json(userData);
        } else {
            const { passwordHash, ...userData } = user._doc;
            res.json(userData);
        }
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
            rsvpStatus,
            dailyRsvp,
            rsvpDate,
            friends,
            reqIn,
            reqOut,
            games,
            gamesIn,
            gamesOut,
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

export const getGameUser = async (req, res) => {
    try {
        const user = await UserModel.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                message: "Пользователь не найден",
            });
        }
        const { 
            rsvpStatus,
            dailyRsvp,
            rsvpDate,
            reqIn,
            reqOut,
            games,
            gamesIn,
            gamesOut,
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

export const getFriends = async (req, res) => {
    try {
        const friends = req.body.friends

        const users = await UserModel.find({ _id: { $in: friends } });

        if (!users) {
            return res.status(404).json({
                message: "Не удалось найти",
            });
        }

        res.json(users);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Ошибка при поиске пользователей',
        });
    }
};

export const removeFriend = async (req, res) => {
    const user = req.userId
    const friend = req.params.id
    try {
        await UserModel.findOneAndUpdate({ _id: req.params.id },
            { $pull: { friends: user}}, { new:true})
            .catch((err) => console.log(err));

        await UserModel.findOneAndUpdate({ _id:req.userId },
            { $pull: { friends: friend}}, { new:true})
            .catch((err) => console.log(err));

        res.json({
            success: true,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Ошибка при удалении друга',
        });
    }
};

export const addFriend = async (req, res) => {
    const user = req.userId
    const friend = req.params.id
    try {
        await UserModel.findOneAndUpdate({ _id: req.params.id },
            { $push: { reqIn: user}}, { new:true})
            .catch((err) => console.log(err));

        await UserModel.findOneAndUpdate({ _id:req.userId },
            { $push: { reqOut: friend}}, { new:true})
            .catch((err) => console.log(err));

        res.json({
            success: true,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Ошибка при удалении друга',
        });
    }
};

export const consfirmRequest = async (req, res) => {
    const user = req.userId
    const friend = req.params.id
    try {
        await UserModel.findOneAndUpdate({ _id: req.params.id },
            { 
                $push: { friends: user},
                $pull: { reqOut: user}
            }, { new:true})
            .catch((err) => console.log(err));

        await UserModel.findOneAndUpdate({ _id:req.userId },
            { 
                $push: { friends: friend},
                $pull: { reqIn: friend}
            }, { new:true})
            .catch((err) => console.log(err));

        res.json({
            success: true,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Ошибка при принятии заявки',
        });
    }
};

export const rejectRequest = async (req, res) => {
    const user = req.userId
    const friend = req.params.id
    try {
        await UserModel.findOneAndUpdate({ _id: req.params.id },
            { 
                $pull: { reqOut: user}
            }, { new:true})
            .catch((err) => console.log(err));

        await UserModel.findOneAndUpdate({ _id:req.userId },
            { 
                $pull: { reqIn: friend}
            }, { new:true})
            .catch((err) => console.log(err));

        res.json({
            success: true,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Ошибка при удалении заявки',
        });
    }
};

export const deleteRequest = async (req, res) => {
    const user = req.userId
    const friend = req.params.id
    try {
        await UserModel.findOneAndUpdate({ _id: req.params.id },
            { 
                $pull: { reqIn: user}
            }, { new:true})
            .catch((err) => console.log(err));

        await UserModel.findOneAndUpdate({ _id:req.userId },
            { 
                $pull: { reqOut: friend}
            }, { new:true})
            .catch((err) => console.log(err));

        res.json({
            success: true,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Ошибка при удалении заявки',
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
    let status = req.body.profileStatus;
    if (status.length > 150) {
        status = status.slice(0, 150);
    }
    try {
        const user = await UserModel.findOneAndUpdate(
            {
                _id: req.userId,
            },
            {
                $set: {
                    fullname: req.body.fullname,
                    profileStatus: status,
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

export const patchRsvp = async (req, res) => {
    try {
        const user = await UserModel.findById(req.userId);
        user.rsvp += 1;
        await user.save();
        res.status(200);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Проблема с начислением rsvp",
        });
    }
};

const savePic = async (id, path) => {
    const user = await UserModel.findById(id);
    if(user.pic !== 'none'){
        fs.unlink(`${user.pic}`, (error) => {
            if (error) {
                console.error('Ошибка при удалении старого изображения:', error);
            } else {
                console.log('Старое изображение успешно удалено');
            }
        });
    }
    await UserModel.findOneAndUpdate(
        {
            _id: id
        },
        {
            $set: {
                pic: path,
            },
        },
        { returnDocument: "after" }
    ).then(()=>console.log('OK')).catch((err)=> console.log(err));
}

export const updatePic = async (req, res) => {

    const pathToImage = `/app/uploads/${req.file.originalname}`;
    
    // Путь для сохранения конвертированного изображения в формате WebP
    const pathToWebPImage = `/app/uploads/webp-${req.file.originalname}.webp`;

    // Конвертирование изображения в формат WebP
    sharp(pathToImage)
    .toFormat('webp')
    .resize({ width: 500, height: 500 })
    .toFile(pathToWebPImage)
    .then(() => {
        console.log('Изображение успешно конвертировано в формат WebP');
        savePic( req.userId, `/app/uploads/webp-${req.file.originalname}.webp`)
        res.sendStatus(200);
        // Удаление исходного изображения
        fs.unlink(pathToImage, (error) => {
        if (error) {
            console.error('Ошибка при удалении исходного изображения:', error);
        } else {
            console.log('Исходное изображение успешно удалено');
        }
        });
    })
    .catch((error) => {
        console.error('Ошибка при конвертировании изображения:', error);
        res.status(500).json({
            message: "Не удалось обновить данные",
        });
    });
};

export const updateRsvpDate = async (req, res) => {
    try {
        const user = await UserModel.findById(req.userId);
        if (user.status === 'sponsor') {
            user.dailyRsvp = 10;
        } else if (user.status === 'none') {
            user.dailyRsvp = 3;
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
                _id: req.userId,
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
                _id: req.params.id,
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