import UserModel from "../models/User.js";

export const getUser = async ( io, userId, vkid ) => {
    try {
        const user = await UserModel.findOne({ vkid: vkid });
        if(user){
            io.to(userId).emit("updatedUser", { data: { user } })
        } else {
            io.to(userId).emit("updatedUser", { data: { user:{name:'none'} } })
        }

    } catch (err) {
        console.log(err);
        io.to(gameId).emit("error", { data: "Нет доступа", err });
    }
};