import QuestionModel from '../models/Question.js';

export const create = async (req,res) => {
    try {
        const doc = new QuestionModel({
            theme: req.body.theme,
            text: req.body.text,
            answer1: req.body.answer1,
            answer2: req.body.answer2,
            answer3: req.body.answer3,
            answer4: req.body.answer4,
        });

        const chat = await doc.save();

        res.json(chat);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось создать вопрос',
        });
    }
}

export const getAll = async (req, res) => {
    try {
        const messages = await QuestionModel.find();

        if (!messages) {
            return res.status(404).json({
                message: "Вопрос не найден",
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

export const getQuestions = async (req, res) => {
    try {
        const messages = await QuestionModel.find({ theme: req.body.theme, });

        if (!messages) {
            return res.status(404).json({
                message: "Вопрос не найден",
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
        QuestionModel.findOneAndDelete(
            {
                _id: req.params.id,
            },
            (err, doc) => {
                if (err) {
                    return res.status(500).json({
                        message: 'Не удалось удалить вопрос',
                    });
                }

                if (!doc) {
                    return res.status(404).json({
                        message: 'Вопрос не найдена'
                    });
                }
                res.json({
                    success: "Вопрос удален"
                });
            }
        );

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Проблема с удалением вопроса',
        });
    }
}