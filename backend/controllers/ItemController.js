import ItemModel from "../models/Item.js";

export const create = async (req,res) => {
    try {
        const doc = new ItemModel({
            item: req.body.item, //id товара в приложении
            title: req.body.title,
            price: req.body.price,
            type: req.body.type,
            count: req.body.count,
        });

        const item = await doc.save();

        res.status(200).json(item);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Не удалось создать item",
        });
    }
}

export const getOne = async (req, res) => {
    try {
        const item = await ItemModel.findOne({ item_id: req.body.item_id });

        if (!item) {
            return res.status(404).json({
                message: "Item не найден",
            });
        }

        res.status(200).json(item);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Error",
        });
    }
};

export const getItems = async (req, res) => {
    try {
        const items = await ItemModel.find();

        if (!items) {
            return res.status(404).json({
                message: "Items нет",
            });
        }

        res.status(200).json(items);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Нет доступа",
        });
    }
};

export const remove = async (req, res) => {
    try {
        ItemModel.findOneAndDelete(
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
                        message: 'Item не найден'
                    });
                }
                res.json({
                    success: "Item удален"
                });
            }
        );
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Проблема с удалением itema",
        });
    }
};