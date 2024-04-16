import UserModel from "../models/User.js";

export const getUser = async ( io, vkid ) => {
    try {
        const user = await UserModel.findOne({ vkid: vkid });
        if(user){
            io.to(vkid).emit("updatedUser", { data: { user } })
        } else {
            io.to(vkid).emit("updatedUser", { data: { user:{ firstName:'$2b$10$T72I44FcHBIcS81xrkFY3e2TJwaaTVLFp7d5wuddKeVEuc2.3WR0G' } } })
        }

    } catch (err) {
        console.log(err);
        io.to(vkid).emit("error", { data: "Нет доступа", err });
    }
};

export const register = async ( io, vkid, status, firstName, avaUrl ) => {
    try {
        const doc = new UserModel({
            vkid: vkid,
            status: status,
            firstName: firstName,
            avaUrl: avaUrl,
        });
    
        const user = await doc.save();

        io.to(vkid).emit("updatedUser", { data: { user } })
        
    } catch (err) {
        console.log(err);
        io.to(vkid).emit("error", { data: "Не удалoсь зарегистрироваться", err });
    }
};