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
            sponsor: req.body.sponsor,
            correct: req.body.correct,
        });

        const chat = await doc.save();

        res.status(200).json(chat);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось создать вопрос',
        });
    }
}

export const createMany = async (req, res) => {
    try {
        const questions = req.body.questions; // предположим, что req.body.questions - это массив вопросов

        for (let i = 0; i < questions.length; i++) {
            const doc = new QuestionModel({
                theme: questions[i].theme,
                text: questions[i].text,
                answer1: questions[i].answer1,
                answer2: questions[i].answer2,
                answer3: questions[i].answer3,
                answer4: questions[i].answer4,
                sponsor: questions[i].sponsor,
                correct: questions[i].correct,
            });

            await doc.save();
        }

        res.status(200).json({
            message: "Success",
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Не удалось создать вопросы",
        });
    }
};

export const getAll = async (req, res) => {
    try {
        const messages = await QuestionModel.find();

        if (!messages) {
            return res.status(404).json({
                message: "Вопрос не найден",
            });
        }

        res.status(200).json(messages);
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

        res.status(200).json(messages);
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
                res.status(200).json({
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

export const removeMany = async (req, res) => {
    try {
        QuestionModel.deleteMany({ theme: req.body.theme }, (err, doc) => {
            if (err) {
                return res.status(500).json({ 
                    message: "Не удалось удалить вопросы",
                });
            }

            if (!doc) {
                return res.status(404).json({
                    message: "Вопросов не найдено",
                });
            }
            res.status(200).json({
                success: "вопросы удалены",
            });
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Проблема с удалением вопросов",
        });
    }
};