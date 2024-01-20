import StatModel from "../models/Stat.js";

export const getAll = async (req, res) => {
    try {
        const stats = await StatModel.find().exec();
        res.json(stats);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Не удалось найти",
        });
    }
};