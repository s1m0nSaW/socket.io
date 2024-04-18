import Rating from "../models/Rating.js";
import GameModel from "../models/Game.js";
import UserModel from "../models/User.js";

export const getThemes = async (io, vkid) => {
    try {
        const ratings = await Rating.find().exec();
        io.to(vkid).emit("ratings", { data: { ratings } })
    } catch (err) {
        console.log(err);
        io.to(vkid).emit("error", { data: "Что-то пошло не так", err });
    }
};

export const newGame = async (io, fields) => {
    try {
        const user = await UserModel.findOne({ vkid: fields.vkid });
        const rating = await RatingModel.findOne({ theme: fields.theme });
        
        if (user.status === 'sponsor'){
            if (user.rsvp > 0) {
                const doc = new GameModel({
                    gameName: fields.gameName,
                    theme: fields.theme,
                    quiz: fields.quiz,
                    turn: fields.turn,
                    forSponsor: fields.forSponsor,
                    user1: fields.user1, // создатель
                    user2: fields.user2,
                    userUrl1: fields.userUrl1, 
                    userUrl2: fields.userUrl2,
                });
        
                const game = await doc.save();
        
                UserModel.findById(fields.user1)
                .then(user1 => {
                    // Добавление идентификатор2 в поле gameIn первого пользователя
                    user1.gamesOut.push(game._id);
                    user1.rsvp -= 1;
                    user1.createGamesCount += 1;
                    io.to(fields.vkid).emit("updatedUser", { data: { user1 } })
                    return user1.save();
                })
                .then(savedUser1 => {
                    // Получение данных второго пользователя
                    return UserModel.findById(fields.user2);
                })
                .then(user2 => {
                    // Добавление идентификатор1 в поле gameOut второго пользователя
                    user2.gamesIn.push(game._id);
                    return user2.save();
                })
                .catch(error => {
                    console.error(error);
                });
                
                io.to(fields.vkid).emit("notification", { data: { message: 'Игра создана', severity:'success' } })
            } else {
                io.to(fields.vkid).emit("notification", { data: { message: 'Недостаточно rsvp', severity:'error' } })
            }
        } else {
            if(rating.forSponsor){
                io.to(fields.vkid).emit("notification", { data: { message: 'Не удалось создать игру', severity:'error' } })
            } else {
                if (user.rsvp > 0) {
                    const doc = new GameModel({
                        gameName: fields.gameName,
                        theme: fields.theme,
                        turn: fields.turn,
                        forSponsor: fields.forSponsor,
                        user1: fields.user1, // создатель
                        user2: fields.user2,
                        userUrl1: fields.userUrl1, 
                        userUrl2: fields.userUrl2,
                    });
            
                    const game = await doc.save();
            
                    UserModel.findById(fields.user1)
                    .then(user1 => {
                        // Добавление идентификатор2 в поле gameIn первого пользователя
                        user1.gamesOut.push(game._id);
                        user1.rsvp -= 1;
                        user1.createGamesCount += 1;
                        io.to(fields.vkid).emit("updatedUser", { data: { user1 } })
                        return user1.save();
                    })
                    .then(savedUser1 => {
                        // Получение данных второго пользователя
                        return UserModel.findById(fields.user2);
                    })
                    .then(user2 => {
                        // Добавление идентификатор1 в поле gameOut второго пользователя
                        user2.gamesIn.push(game._id);
                        return user2.save();
                    })
                    .catch(error => {
                        console.error(error);
                    });
            
                    io.to(fields.vkid).emit("game", { data: { game } })
                } else {
                    io.to(fields.vkid).emit("notification", { data: { message: 'Недостаточно rsvp', severity:'error' } })
                }
            }
        }
    } catch (err) {
        console.log(err);
        io.to(fields.vkid).emit("notification", { data: { message: 'Не удалось создать игру', severity:'error' } })
    }
};

export const newUser = async ( io, vkid, playerId, status, firstName, avaUrl ) => {
    try {
        const user = await UserModel.findOne({ vkid: playerId });
        if(user){
            io.to(vkid).emit("friend", { data: { player: user } })
        } else {
            const doc = new UserModel({
                vkid: playerId,
                status: status,
                firstName: firstName,
                avaUrl: avaUrl,
            });
        
            const player2 = await doc.save();
    
            if(player2){
                io.to(vkid).emit("friend", { data: { player: player2 } })
            }
        }
    } catch (err) {
        console.log(err);
        io.to(vkid).emit("error", { data: "Что-то пошло не так", err });
    }
};