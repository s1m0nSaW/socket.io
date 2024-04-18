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