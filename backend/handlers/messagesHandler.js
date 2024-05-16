import MessageModel from "../models/Message.js";
import UserModel from "../models/User.js";

export const sendMessageHandler = async (io, userId, senderId, content, gameId, date) => {
    try {
        let user = await UserModel.findById(senderId)
        if(userId === user.vkid){
            const doc = new MessageModel({
                senderId: senderId,
                content: content,
                gameId: gameId,
                date: date,
            });
    
            const message = await doc.save();
    
            if(message) {
                const messages = await MessageModel.find({ gameId: gameId });
                io.to(gameId).emit("gameMessages", { data: messages.reverse()});
            }
        }
    } catch (err) {
        console.log(err);
        io.to(gameId).emit("message", { data: "Не удалось создать сообщение"});
    }
};

export const typingMessage = async (io, vkid, gameId, status) => {
    try {
        io.to(gameId).emit("typingMessage", { data: {vkid, status}});
    } catch (err) {
        console.log(err);
    }
};

export const getMessagesHandler = async (io, gameId) => {
    try {
        const messages = await MessageModel.find({ gameId: gameId });

        if (messages) {
            io.to(gameId).emit("gameMessages", { data: messages.reverse()});
        }

    } catch (err) {
        console.log(err);
        io.to(gameId).emit("gameMessages", { data: "Нет доступа"});
    }
}