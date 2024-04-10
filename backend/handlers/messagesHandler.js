import MessageModel from "../models/Message.js";

export const sendMessageHandler = async (io, senderId, content, gameId, date) => {
    try {
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

    } catch (err) {
        console.log(err);
        io.to(gameId).emit("message", { data: "Не удалось создать сообщение"});
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