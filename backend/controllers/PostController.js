import PostModel from "../models/Post.js";

export const create = async (req,res) => {
    try {
        const doc = new PostModel({
            text: req.body.text,
            date: req.body.date,
        });

        await doc.save();

        const posts = await PostModel.find().exec();

        if (!posts) {
            return res.status(404).json({
                message: "Заявок нет",
            });
        } else {
            res.json(posts);
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось создать заявку',
        });
    }
}

export const update = async (req, res) => {
    try {
        await PostModel.findOneAndUpdate(
            {
                _id: req.body._id,
            },
            {
                $set: {
                    text: req.body.text,
                },
            },
            { returnDocument: "after" }
        );
        res.json({
            success: "Пост отредактирован",
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Не удалось обновить пост",
        });
    }
};

export const like = async (req, res) => {
    try {
        const reaction = req.body.reaction;
        if(reaction === 'positive') {
            await PostModel.findOneAndUpdate(
                {
                    _id: req.params.id,
                },
                {
                    $push: {positive: req.body.id},
                },
                { returnDocument: "after" }
            );
            res.json({
                success: "Like поставлен",
            });
        } else if (reaction === 'negative') {
            await PostModel.findOneAndUpdate(
                {
                    _id: req.params.id,
                },
                {
                    $push: {negative: req.body.id},
                },
                { returnDocument: "after" }
            );
            res.json({
                success: "Like поставлен",
            });
        } else {
            res.status(500).json({
                message: "Не удалось поставить like",
            });
        }
        
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Не удалось поставить like",
        });
    }
};

export const getPosts = async (req, res) => {
    try {
        const posts = await PostModel.find().exec();

        if (!posts) {
            return res.status(404).json({
                message: "Постов нет",
            });
        } else {
            res.json(posts);
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Нет доступа",
        });
    }
};

export const remove = async (req, res) => {
    try {
        PostModel.findOneAndDelete(
            {
                _id: req.params.id,
            },
            (err, doc) => {
                if (err) {
                    return res.status(500).json({
                        message: 'Не удалось удалить',
                    });
                }

                if (!doc) {
                    return res.status(404).json({
                        message: 'Пост не найдена'
                    });
                }
                res.json({
                    success: "Пост удален"
                });
            }
        );

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Проблема с удалением поста',
        });
    }
}