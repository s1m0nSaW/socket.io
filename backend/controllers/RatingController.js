import Rating from "../models/Rating.js";

export const create = async (req,res) => {
    try {
        const doc = new Rating({
            theme: req.body.theme,
        });

        await doc.save();

        res.json({
            success: "Рейтинг создан",
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось создать рейтинг',
        });
    }
}

export const getRating = async (req, res) => {
    try {
        const rating = await Rating.findOne({ theme: req.body.theme })
        .catch((err)=>{
            console.log(err);
            res.status(404).json({
                message: "Документ не найден",
            });
        });

        if (!rating) {
            return res.status(404).json({
                message: "Документ не найден",
            });
        }

        res.json(rating);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Error",
        });
    }
};

export const getAll = async (req, res) => {
    try {
        const ratings = await Rating.find().exec();
        res.json(ratings);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Не удалось найти",
        });
    }
};

export const update = async (req, res) => {
    try {
        const rating = await Rating.findById(req.params.id);

        if(rating){
            const newRating = Math.round((req.body.rate + (rating.rating * rating.count))/(rating.count + 1));
            const updatedRating = await Rating.findOneAndUpdate(
                {
                    _id: req.params.id,
                },
                {
                    $set: {
                        rating: newRating,
                    },
                    $inc: {count: 1},
                    $push: { games: req.body.gameId},
                },
                { new: true } // Используйте параметр { new: true } для возврата обновленного документа
            );
        }

        res.sendStatus(200);

    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
};

export const remove = async (req, res) => {
    try {
        Rating.findOneAndDelete(
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
                        message: 'Платеж не найден'
                    });
                }
                res.json({
                    success: "Платеж удален"
                });
            }
        );

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Проблема с удалением Платежа',
        });
    }
}