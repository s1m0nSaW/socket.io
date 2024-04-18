import RatingModel from "../models/Rating.js";
import GameModel from "../models/Game.js";
import UserModel from "../models/User.js";

export const getThemes = async (io, vkid) => {
    try {
        const ratings = await RatingModel.find().exec();
        io.to(vkid).emit("ratings", { data: { ratings } })
    } catch (err) {
        console.log(err);
        io.to(vkid).emit("error", { data: "Что-то пошло не так", err });
    }
};

export const newGame = async (io, vkid, gameName, theme, quiz, forSponsor, user1, user2, userUrl1, userUrl2, turn) => {
    try {
        const user = await UserModel.findOne({ vkid: vkid });
        const rating = await RatingModel.findOne({ theme: theme });
        
        if(user && rating)
        {if (user.status === 'sponsor'){
            if (user.rsvp > 0) {
                const doc = new GameModel({
                    gameName: gameName,
                    theme: theme,
                    quiz: quiz,
                    turn: turn,
                    forSponsor: forSponsor,
                    user1: user1, // создатель
                    user2: user2,
                    userUrl1: userUrl1, 
                    userUrl2: userUrl2,
                });
        
                const game = await doc.save();
        
                UserModel.findById(user1)
                .then(user1 => {
                    // Добавление идентификатор2 в поле gameIn первого пользователя
                    user1.gamesOut.push(game._id);
                    user1.rsvp -= 1;
                    user1.createGamesCount += 1;
                    io.to(vkid).emit("updatedUser", { data: { user1 } })
                    return user1.save();
                })
                .then(savedUser1 => {
                    // Получение данных второго пользователя
                    return UserModel.findById(user2);
                })
                .then(user2 => {
                    // Добавление идентификатор1 в поле gameOut второго пользователя
                    user2.gamesIn.push(game._id);
                    return user2.save();
                })
                .catch(error => {
                    console.error(error);
                });
                
                io.to(vkid).emit("notification", { data: { message: 'Игра создана', severity:'success' } })
            } else {
                io.to(vkid).emit("notification", { data: { message: 'Недостаточно rsvp', severity:'error' } })
            }
        } else {
            if(rating.forSponsor){
                io.to(vkid).emit("notification", { data: { message: 'Не удалось создать игру', severity:'error' } })
            } else {
                if (user.rsvp > 0) {
                    const doc = new GameModel({
                        gameName: gameName,
                        theme: theme,
                        turn: turn,
                        forSponsor: forSponsor,
                        user1: user1, // создатель
                        user2: user2,
                        userUrl1: userUrl1, 
                        userUrl2: userUrl2,
                    });
            
                    const game = await doc.save();
            
                    UserModel.findById(user1)
                    .then(user1 => {
                        // Добавление идентификатор2 в поле gameIn первого пользователя
                        user1.gamesOut.push(game._id);
                        user1.rsvp -= 1;
                        user1.createGamesCount += 1;
                        io.to(vkid).emit("updatedUser", { data: { user1 } })
                        return user1.save();
                    })
                    .then(savedUser1 => {
                        // Получение данных второго пользователя
                        return UserModel.findById(user2);
                    })
                    .then(user2 => {
                        // Добавление идентификатор1 в поле gameOut второго пользователя
                        user2.gamesIn.push(game._id);
                        return user2.save();
                    })
                    .catch(error => {
                        console.error(error);
                    });
            
                    io.to(vkid).emit("notification", { data: { message: 'Игра создана', severity:'success' } })
                } else {
                    io.to(vkid).emit("notification", { data: { message: 'Недостаточно rsvp', severity:'error' } })
                }
            }
        }}
    } catch (err) {
        console.log(err);
        io.to(vkid).emit("notification", { data: { message: 'Не удалось создать игру', severity:'error' } })
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