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

export const newGame = async (io, playerId1, playerId2, turn, theme) => {
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
                    turn: turn,
                    forSponsor: rating.forSponsor,
                    user1: player1._id, // создатель
                    user2: player2._id,
                    userUrl1: player1.avaUrl, 
                    userUrl2: player2.avaUrl,
                });
        
                const game = await doc.save();

                player1.gamesOut.push(game._id);
                player1.rsvp -= 1;
                player1.createGamesCount += 1;
                player1.save();
                io.to(player1.vkid).emit("updatedUser", { data: { user: player1 } })
                
                player2.gamesIn.push(game._id);
                player2.save();
                io.to(player2.vkid).emit("updatedUser", { data: { user: player2 } })

                io.to(player2.vkid).emit("notification", { data: { message: `${player1.firstName} пригласил поиграть`, severity:'info' } })
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
                        turn: turn,
                        forSponsor: rating.forSponsor,
                        user1: player1._id, // создатель
                        user2: player2._id,
                        userUrl1: player1.avaUrl, 
                        userUrl2: player2.avaUrl,
                    });
            
                    const game = await doc.save();

                    player1.gamesOut.push(game._id);
                    player1.rsvp -= 1;
                    player1.createGamesCount += 1;
                    player1.save();
                    io.to(player1.vkid).emit("updatedUser", { data: { user: player1 } })
                    
                    player2.gamesIn.push(game._id);
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