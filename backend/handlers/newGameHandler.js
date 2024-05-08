import RatingModel from "../models/Rating.js";
import GameModel from "../models/Game.js";
import UserModel from "../models/User.js";
import axios from "axios";
import dotenv from 'dotenv';
import { getGame } from "./gamePlayHandler.js";

dotenv.config();

const service = process.env.SERVICEKEY

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

export const getThemes = async (io, vkid) => {
    try {
        const ratings = await RatingModel.find().exec();
        io.to(vkid).emit("ratings", { data: { ratings } })
    } catch (err) {
        console.log(err);
        io.to(vkid).emit("error", { data: "Что-то пошло не так", err });
    }
};

export const newGame = async (io, playerId1, playerId2, theme, socketUserIdMap) => {
    try {
        const player1 = await UserModel.findOne({ vkid: playerId1 });
        const player2 = await UserModel.findOne({ vkid: playerId2 });
        const rating = await RatingModel.findOne({ theme: theme });
        
        if (player1.status === 'sponsor'){
            if (player1.rsvp > 0) {
                const doc = new GameModel({
                    gameName: `Игра ${player1.firstName} & ${player2.firstName}`,
                    theme: rating.theme,
                    quiz: rating.quiz,
                    turn: player2._id,
                    forSponsor: rating.forSponsor,
                    user1: player1._id, // создатель
                    user2: player2._id,
                    userUrl1: player1.avaUrl, 
                    userUrl2: player2.avaUrl,
                    user1vkid: player1.vkid,
                    user2vkid: player2.vkid,
                });
        
                const game = await doc.save();
                io.to(player1.vkid).emit("newGameId", { data: { id: game._id } })

                player1.games.push(game._id);
                player1.rsvp -= 1;
                player1.createGamesCount += 1;
                player1.save();
                io.to(player1.vkid).emit("updatedUser", { data: { user: player1 } })
                
                player2.games.push(game._id);
                player2.save();
                io.to(playerId2).emit("updatedUser", { data: { user: player2 } })
                getGame(io, player1, game._id, socketUserIdMap)

                io.to(playerId2).emit("notification", { data: { message: `${player1.firstName} пригласил поиграть`, severity:'info' } })
                sendNotification(playerId2, `${player1.firstName} пригласил поиграть`)
                io.to(player1.vkid).emit("notification", { data: { message: 'Игра создана', severity:'success' } })
            } else {
                io.to(player1.vkid).emit("notification", { data: { message: 'Недостаточно монет', severity:'error' } })
            }
        } else {
            if(rating.forSponsor){
                io.to(player1.vkid).emit("notification", { data: { message: 'Игра только для спонсоров', severity:'error' } })
            } else {
                if (player1.rsvp > 0) {
                    const doc = new GameModel({
                        gameName: `Игра ${player1.firstName} & ${player2.firstName}`,
                        theme: rating.theme,
                        quiz: rating.quiz,
                        turn: player2._id,
                        forSponsor: rating.forSponsor,
                        user1: player1._id, // создатель
                        user2: player2._id,
                        userUrl1: player1.avaUrl, 
                        userUrl2: player2.avaUrl,
                        user1vkid: player1.vkid,
                        user2vkid: player2.vkid,
                    });
            
                    const game = await doc.save();
                    io.to(player1.vkid).emit("newGameId", { data: { id: game._id } })

                    player1.games.push(game._id);
                    player1.rsvp -= 1;
                    player1.createGamesCount += 1;
                    player1.save();
                    io.to(player1.vkid).emit("updatedUser", { data: { user: player1 } })
                    
                    player2.games.push(game._id);
                    player2.save();
                    io.to(player2.vkid).emit("updatedUser", { data: { user: player2 } })
            
                    io.to(player1.vkid).emit("notification", { data: { message: 'Игра создана', severity:'success' } })
                } else {
                    io.to(player1.vkid).emit("notification", { data: { message: 'Недостаточно монет', severity:'error' } })
                }
            }
        }
    } catch (err) {
        console.log(err);
    }
};

export const newUser = async ( io, vkid, playerId, status, firstName, avaUrl ) => {
    try {
        const user = await UserModel.findOne({ vkid: playerId });
        if(user){
            io.to(vkid).emit("friend", { data: { player: user, registred: true } })
        } else {
            const doc = new UserModel({
                vkid: playerId,
                status: status,
                firstName: firstName,
                avaUrl: avaUrl,
            });
        
            const player2 = await doc.save();
    
            if(player2){
                io.to(vkid).emit("friend", { data: { player: player2, registred: false } })
            }
        }
    } catch (err) {
        console.log(err);
        io.to(vkid).emit("error", { data: "Что-то пошло не так", err });
    }
};