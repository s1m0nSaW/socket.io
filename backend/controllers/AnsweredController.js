import AnsweredModel from '../models/Answered.js';

export const create = async (req,res) => {
    try {
        const doc = new AnsweredModel({
            questionId: req.body.questionId,
            gameId: req.body.gameId,
            user1: req.body.user1,
            user2: req.body.user2,
            answer1: req.body.answer1,
            answer2: req.body.answer2,
        });

        const chat = await doc.save();

        res.json(chat);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось создать чат',
        });
    }
}

export const getAnwereds = async (req, res) => {
    try {
        const answereds = await AnsweredModel.find({ gameId: req.params.id });

        if (!answereds) {
            return res.status(404).json({
                message: "Ответов нет",
            });
        }

        res.json(answereds);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Нет доступа",
        });
    }
};

export const remove = async (req, res) => {
    try {
        AnsweredModel.deleteMany({ gameId: req.params.id }, (err, doc) => {
            if (err) {
                return res.status(500).json({
                    message: "Не удалось удалить",
                });
            }

            if (!doc) {
                return res.status(404).json({
                    message: "Чат не найдена",
                });
            }
            res.json({
                success: "Чат удален",
            });
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Проблема с удалением чата",
        });
    }
}