import GameModel from "../models/Game.js";
import UserModel from "../models/User.js";
import MessageModel from "../models/Message.js";
import AnsweredModel from "../models/Answered.js";

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
        console.log( 'fields:', vkid, gameId, 'game:', game, 'user1:', user1, 'user2:', user2)

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

        io.to(user1.vkid).emit("updatedUser", { data: { user1 } })
        io.to(user2.vkid).emit("updatedUser", { data: { user2 } })

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