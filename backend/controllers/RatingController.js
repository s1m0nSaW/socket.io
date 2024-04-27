import Rating from "../models/Rating.js";

export const create = async (req,res) => {
    try {
        const doc = new Rating({
            theme: req.body.theme,
            forSponsor: req.body.forSponsor,
        });

        await doc.save();

        res.status(200).json({
            success: "Рейтинг создан",
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось создать рейтинг',
        });
    }
}

export const createMany = async (req,res) => {
    try {
        const rates = req.body.rates;

        for (let i = 0; i < rates.length; i++) {
            const doc = new Rating({
                theme: rates[i].theme,
                forSponsor: rates[i].forSponsor,
                quiz: rates[i].quiz,
                count: rates[i].count,
		        rating: rates[i].rating,
            });

            await doc.save();
        }

        res.status(200).json({
            success: "Рейтинги созданы",
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

        res.status(200).json(rating);
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
        res.status(200).json(ratings);
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
            const newRating = Math.ceil((req.body.rate + (rating.rating * rating.count))/(rating.count + 1));
            await Rating.findOneAndUpdate(
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

        res.status(200);

    } catch (error) {
        console.log(error);
        res.status(500);
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
                        message: 'Рейтинг не найден'
                    });
                }
                res.status(200).json({
                    success: "Рейтинг удален"
                });
            }
        );

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Проблема с удалением Рейтинга',
        });
    }
}