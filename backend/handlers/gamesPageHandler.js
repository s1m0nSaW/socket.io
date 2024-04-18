import GameModel from "../models/Game.js";
import UserModel from "../models/User.js";

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