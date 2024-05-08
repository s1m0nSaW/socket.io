import GameModel from "../models/Game.js";
import UserModel from "../models/User.js";
import MessageModel from "../models/Message.js";
import AnsweredModel from "../models/Answered.js";
import Question from "../models/Question.js";
import Rating from "../models/Rating.js";
import axios from "axios";
import dotenv from 'dotenv';

dotenv.config();

const service = process.env.SERVICEKEY

export const getGames = async ( io, vkid ) => {
    try {
        const user = await UserModel.findOne({ vkid: vkid });

        if(user) {
            const incoming = await GameModel.find({ _id: { $in: user.gamesIn } });
            const outgoing = await GameModel.find({ _id: { $in: user.gamesOut } });
            io.to(vkid).emit("incoming", { data: incoming.length});
            io.to(vkid).emit("outgoing", { data: outgoing.length});
        }
        
    } catch (err) {
        console.log(err);
    }
};

export const myGames = async ( io, vkid, socketUserIdMap ) => {
    try {
        const user = await UserModel.findOne({ vkid: vkid });

        if(user) {
            const games = await GameModel.find({ _id: { $in: user.games } });
            io.to(user.vkid).emit("updatedUser", { data: { user: user } })
            io.to(vkid).emit("onlines", { data: socketUserIdMap })
            io.to(vkid).emit("myGames", { data: games});
        }
        
    } catch (err) {
        console.log(err);
    }
};

export const gamesIn = async ( io, vkid ) => {
    try {
        const user = await UserModel.findOne({ vkid: vkid });

        if(user) {
            const games = await GameModel.find({ _id: { $in: user.gamesIn } });
            io.to(vkid).emit("myGames", { data: games});
        }
        
    } catch (err) {
        console.log(err);
    }
};

export const gamesOut = async ( io, vkid ) => {
    try {
        const user = await UserModel.findOne({ vkid: vkid });

        if(user) {
            const games = await GameModel.find({ _id: { $in: user.gamesOut } });
            io.to(vkid).emit("myGames", { data: games});
        }
        
    } catch (err) {
        console.log(err);
    }
};

export const removeGame = async ( io, vkid, gameId ) => {
    try {
        const game = await GameModel.findById(gameId);
        let user1 = await UserModel.findById(game.user1)
        let user2 = await UserModel.findById(game.user2)

        user1.games.pull(gameId); 
        await user1.save();

        user2.games.pull(gameId);
        await user2.save();

        io.to(user1.vkid).emit("updatedUser", { data: { user: user1 } })
        io.to(user2.vkid).emit("updatedUser", { data: { user: user2 } })

        MessageModel.deleteMany({ gameId: gameId }, (err, doc) => {
            if (err) {
                console.log("Не удалось удалить сообщения", gameId)
            }
            if (!doc) {
                console.log("Сообщения не найдены", gameId)
            }
            console.log("Сообщения удалены", gameId)
        });

        AnsweredModel.deleteMany({ gameId: gameId }, (err, doc) => {
            if (err) {
                console.log("Не удалось удалить answereds", gameId)
            }
            if (!doc) {
                console.log("answereds не найдены", gameId)
            }
            console.log("answereds удалены", gameId)
        });

        GameModel.findOneAndDelete(
            {
                _id: gameId,
            },
            (err, doc) => {
                if (err) {
                    console.log('Не удалось удалить игру', gameId)
                }

                if (!doc) {
                    console.log('Игра не найдена', gameId)
                } else {
                    io.to(user1.vkid).emit("onRemoveGame", { data: "the game is removed" })
                    io.to(user2.vkid).emit("onRemoveGame", { data: "the game is removed" })
                    if(vkid === user1.vkid){
                        io.to(user2.vkid).emit("notification", { data: { message: `${user1.firstName} удалил(-а) игру`, severity:'info' } })
                        io.to(user1.vkid).emit("notification", { data: { message: `Игра удалена`, severity:'info' } })
                    } else {
                        io.to(user1.vkid).emit("notification", { data: { message: `${user2.firstName} удалил(-а) игру`, severity:'info' } })
                        io.to(user2.vkid).emit("notification", { data: { message: `Игра удалена`, severity:'info' } })
                    }
                }
            }
        );

    } catch (err) {
        console.log('Проблема с удалением игры', err);
    }
}

const sendNotification = async (playerId, text) => {
    try {
        // Отправляем первый POST-запрос для проверки разрешения на уведомления
        const response1 = await axios.post(
            "https://api.vk.com/method/apps.isNotificationsAllowed",
            {
                user_id: playerId,
                apps_id: 51864614,
                access_token: service,
                v: 5.199,
            }
        );

        if (response1.data.response.is_allowed) {
            // Если получено разрешение на уведомления, отправляем второй POST-запрос для отправки уведомления
            const response2 = await axios.post(
                "https://api.vk.com/method/notifications.sendMessage",
                {
                    user_ids: playerId,
                    message: text,
                    fragment: "/games",
                    access_token: service,
                    v: 5.199,
                }
            );

            console.log(response2.data);
        }
    } catch (error) {
        console.error(error);
    }
}

export const acceptGame = async (io, gameId, service ) => {
    try {
        GameModel.findOneAndUpdate({ _id: gameId }, { status: 'active' }, { new: true })
            .then(game => {
                UserModel.findOneAndUpdate({ _id: game.user1 }, 
                                        { $push: { games: game._id }, $pull: { gamesOut: game._id } }, 
                                        { new: true })
                .then(user1 => {
                    io.to(user1.vkid).emit("updatedUser", { data: { user: user1 } })
                    UserModel.findOneAndUpdate({ _id: game.user2 }, 
                                            { $push: { games: game._id }, $pull: { gamesIn: game._id } }, 
                                            { new: true })
                    .then(async(user2) => {
                        io.to(user2.vkid).emit("updatedUser", { data: { user: user2 } });
                        io.to(user1.vkid).emit("notification", { data: { message: `Пользователь ${user2.firstName} согласен играть`, severity:'info' } });
                        sendNotification(user1.vkid, `Пользователь ${user2.firstName} согласен играть`);
                        const games = await GameModel.find({ _id: { $in: user1.games } });
                        const games2 = await GameModel.find({ _id: { $in: user2.games } });
                        io.to(user1.vkid).emit("myGames", { data: games});
                        io.to(user2.vkid).emit("myGames", { data: games2});
                    })
                    .catch(error => {
                        console.log('Something went wrong', error);
                    });
                })
                .catch(error => {
                    console.log('Something went wrong', error);
                });
            })
            .catch(error => {
                console.log('Something went wrong', error);
            });
        

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Нет доступа",
        });
    }
};

export const allGames = async (io, vkid) => {
    try {
        const rates = await Rating.find().exec();
        const themes = await Question.find().exec();
        io.to(vkid).emit("allgames", { data: {rates, themes}});
    } catch (err) {
        console.log(err);
    }
};