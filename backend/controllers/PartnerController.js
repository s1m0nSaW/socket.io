import PartnerModel from '../models/Parnter.js'

export const create = async (req,res) => {
    try {
        const doc = new PartnerModel({
            name: req.body.name,
            phone: req.body.phone,
            mail: req.body.mail,
            status: req.body.status,
            shopName: req.body.shopName,
            city: req.body.city,
            product: req.body.product,
            count: req.body.count,
            website: req.body.website,
        });

        await doc.save();

        res.json({
            success: "Заявка принята",
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось создать заявку',
        });
    }
}

export const getParnters = async (req, res) => {
    try {
        const posts = await PartnerModel.find().exec();

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
            message: "Нет доступа",
        });
    }
};

export const remove = async (req, res) => {
    try {
        PartnerModel.findOneAndDelete(
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