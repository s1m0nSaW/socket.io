import MessageModel from '../models/Message.js';

export const create = async (req,res) => {
    try {
        const doc = new MessageModel({
            senderId: req.body.senderId,
            content: req.body.content,
            gameId: req.body.gameId,
        });

        const message = await doc.save();

        res.json(message);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Не удалось создать сообщение",
        });
    }
}

export const getMessages = async (req, res) => {
    try {
        const messages = await MessageModel.find({ gameId: req.params.id });

        if (!messages) {
            return res.status(404).json({
                message: "Сообщений нет",
            });
        }

        res.json(messages);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Нет доступа",
        });
    }
};

export const remove = async (req, res) => {
    try {
        MessageModel.deleteMany({ gameId: req.params.id }, (err, doc) => {
            if (err) {
                return res.status(500).json({ 
                    message: "Не удалось удалить сообщения",
                });
            }

            if (!doc) {
                return res.status(404).json({
                    message: "Сообщение не найдено",
                });
            }
            res.json({
                success: "Сообщение удалено",
            });
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Проблема с удалением сообщения",
        });
    }
};