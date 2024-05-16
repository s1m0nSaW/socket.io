import ComplimentModel from "../models/Compliment.js";

export const create = async (req,res) => {
    try {
        const doc = new ComplimentModel({
            from: req.body.from,
            to: req.body.to,
            price: req.body.price,
            image: req.body.image,
            name: req.body.name,
        });

        const compliment = await doc.save();

        res.status(200).json(compliment);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Не удалось создать compliment",
        });
    }
}

export const getMy = async (req, res) => {
    try {
        const compliments = await ComplimentModel.find({ to: req.body.id });

        if (!compliments) {
            return res.status(404).json({
                message: "Compliments нет",
            });
        }

        res.status(200).json(compliments);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Нет доступа",
        });
    }
};

export const getAll = async (req, res) => {
    try {
        const compliments = await ComplimentModel.find();

        if (!compliments) {
            return res.status(404).json({
                message: "Compliments нет",
            });
        }

        res.status(200).json(compliments);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Нет доступа",
        });
    }
};

export const remove = async (req, res) => {
    try {
        ComplimentModel.deleteMany({ _id: req.params.id }, (err, doc) => {
            if (err) {
                return res.status(500).json({ 
                    message: "Не удалось удалить compliments",
                });
            }

            if (!doc) {
                return res.status(404).json({
                    message: "compliments не найдены",
                });
            }
            res.status(200).json({
                success: "compliments удалены",
            });
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Проблема с удалением compliments",
        });
    }
};

export const removeAll = async (req, res) => {
    try {
        ComplimentModel.deleteMany({}, (err, doc) => {
            if (err) {
                return res.status(500).json({ 
                    message: "Не удалось удалить compliments",
                });
            }

            if (!doc) {
                return res.status(404).json({
                    message: "compliments не найдены",
                });
            }
            res.status(200).json({
                success: "compliments удалены",
            });
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Проблема с удалением compliments",
        });
    }
};