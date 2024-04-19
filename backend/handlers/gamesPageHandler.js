import GameModel from "../models/Game.js";
import UserModel from "../models/User.js";
import MessageModel from "../models/Message.js";
import AnsweredModel from "../models/Answered.js";
import Question from "../models/Question.js";
import Rating from "../models/Rating.js";

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

export const myGames = async ( io, vkid ) => {
    try {
        const user = await UserModel.findOne({ vkid: vkid });

        if(user) {
            const games = await GameModel.find({ _id: { $in: user.games } });
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

        if(game.status === 'active') {
            user1.games.pull(gameId); 
            await user1.save();

            user2.games.pull(gameId);
            await user2.save();
        } else {
            user1.gamesOut.pull(gameId); 
            await user1.save();

            user2.gamesIn.pull(gameId);
            await user2.save();
        }

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
                        io.to(user2.vkid).emit("notification", { data: { message: `${user1.firstName} удалил игру`, severity:'info' } })
                        io.to(user1.vkid).emit("notification", { data: { message: `Игра удалена`, severity:'info' } })
                    } else {
                        io.to(user1.vkid).emit("notification", { data: { message: `${user2.firstName} удалил игру`, severity:'info' } })
                        io.to(user2.vkid).emit("notification", { data: { message: `Игра удалена`, severity:'info' } })
                    }
                }
            }
        );

    } catch (err) {
        console.log('Проблема с удалением игры', err);
    }
}

export const acceptGame = async (io, gameId) => {
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
                    .then(user2 => {
                        io.to(user2.vkid).emit("updatedUser", { data: { user: user2 } })
                        io.to(user2.vkid).emit("notification", { data: { message: `Вы согласились играть с ${user1.firstName}`, severity:'info' } })
                        io.to(user1.vkid).emit("notification", { data: { message: `Пользователь ${user2.firstName} согласен играть`, severity:'info' } })
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