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
            io.to(data.id).emit("gameMessages", { data: messages.reverse()});
        }

    } catch (err) {
        console.log(err);
        io.to(gameId).emit("message", { data: "Не удалось создать сообщение"});
    }
};

export const getMessagesHandler = async (io, data) => {
    try {
        const messages = await MessageModel.find({ gameId: data.id });

        if (messages) {
            io.to(data.id).emit("gameMessages", { data: messages.reverse()});
        }

    } catch (err) {
        console.log(err);
        io.to(data.id).emit("gameMessages", { data: "Нет доступа"});
    }
}