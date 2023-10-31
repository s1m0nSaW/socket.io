import RequestModel from "../models/Requests.js";
import UserModel from "../models/User.js";

export const create = async (req,res) => {
    try {
        const user = await UserModel.findById(req.userId);
        if(user.balance >= req.body.amount ) {
            if(req.body.amount > 0)
            {await UserModel.findOneAndUpdate(
                {
                    _id: req.userId,
                },
                {
                    $set: {
                        balance: user.balance - req.body.amount,
                    },
                },
                { returnDocument: "after" }
            );
            const doc = new RequestModel({
                amount: req.body.amount,
                userId: req.userId,
                date: req.body.date,
                requisites: req.body.requisites,
            });
    
            await doc.save();
    
            res.json({
                success: "Заявка принята",
            });} else {
                res.json({
                    success: "Заявка отклонена",
                });
            }
        } else {
            res.json({
                success: "Заявка отклонена",
            });
        }
        
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось создать заявку',
        });
    }
}

export const updateStatus = async (req, res) => {
    try {
        const user = await RequestModel.findOneAndUpdate(
            {
                _id: req.body._id,
            },
            {
                $set: {
                    status: req.body.status,
                },
            },
            { returnDocument: "after" }
        );
        if(user){
            const requests = await RequestModel.find().exec();
            res.json(requests);
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Не удалось обновить данные",
        });
    }
};

export const getRequests = async (req, res) => {
    try {
        const requests = await RequestModel.find({userId: req.userId});

        if (!requests) {
            return res.status(404).json({
                message: "Заявок нет",
            });
        }

        res.json(requests);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Нет доступа",
        });
    }
};

export const getAllRequests = async (req, res) => {
    try {
        const requests = await RequestModel.find().exec();

        if (!requests) {
            return res.status(404).json({
                message: "Заявок нет",
            });
        }

        res.json(requests);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Нет доступа",
        });
    }
};

export const remove = async (req, res) => {
    try {
        RequestModel.findOneAndDelete(
            {
                _id: req.params.id,
            },
            (err, doc) => {
                if (err) {
                    console.log(err);
                    return res.status(500).json({
                        message: 'Не удалось удалить',
                    });
                }

                if (!doc) {
                    return res.status(404).json({
                        message: 'Заявка не найдена'
                    });
                }

                res.json({
                    success: "Заявка удалена"
                });
            }
        );
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Проблема с удалением заявки',
        });
    }
}