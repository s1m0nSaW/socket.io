import Payment from "../models/Payment.js";
import User from "../models/User.js";

const updateStat = async (data) => {
    const today = new Date(); // Получаем текущую дату
    today.setHours(0, 0, 0, 0); // Устанавливаем время в полночь

    let count
    if(data === 2592000000) count = 299;
    if(data === 77760000000) count = 1990;
    if(data === 10) count = 99;
    if(data === 30) count = 199;
    if(data === 100) count = 499;
    
    StatModel.findOne({ date: today }, (err, stat) => {
        if (err) {
            console.error('Ошибка при поиске статистики:', err);
        } else {
            if (stat) {
                // Нашли объект статистики для сегодняшней даты
                // Теперь мы можем вносить изменения
                //stat.newGames.push(user_id); // Добавляем новую строку в массив strings
                stat.payments.push(count); // Добавляем число 42 в массив numbers
                // Сохраняем изменения в базе данных
                stat.save();
            } else {
                // Объект статистики для сегодняшней даты не найден, создаем новый объект статистики
                const newStatistic = new StatModel({
                    date: today,
                    // newGames: [user_id],
                    payments: [count],
                });

                // Сохраняем новый объект статистики в базе данных
                newStatistic.save();
            }
        }
    });
}

export const create = async (req,res) => {
    try {
        const doc = new Payment({
            paymentId: req.body.paymentId,
            paymentStatus: req.body.status,
            user: req.userId,
            type: req.body.type,
            count: req.body.count,
        });

        await doc.save();

        res.json({
            success: "Платеж создан",
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось создать заявку',
        });
    }
}

export const payments = async (req, res) => {
    const data = req.body;
    if(data.object.status === "succeeded") {
        try {
            const payment = await Payment.findOneAndUpdate(
                {
                    paymentId: data.object.id,
                },
                {
                    $set: {
                        paymentStatus: data.object.status,
                    },
                },
                { returnDocument: "after" }
            );

            updateStat(payment.count);

            if(payment.type === 'retail') {
                await User.findOneAndUpdate(
                    {
                        _id: payment.user,
                    },
                    {
                        $inc: {rsvp: payment.count},
                    },
                    { returnDocument: "after" }
                );
            } else if(payment.type === 'sponsor') {
                const user = await User.findById(payment.user);
                if (user.status === 'sponsor') {
                    user.statusDate += payment.count;
                } else if (user.status === 'none') {
                    user.status = 'sponsor';
                    user.statusDate = +new Date() + payment.count;
                }
                await user.save();
            }

            res.sendStatus(200);

        } catch (error) {
            console.log(error);
            res.sendStatus(500);
        }
    } else {
        try {
            await Payment.findOneAndUpdate(
                {
                    paymentId: data.object.id,
                },
                {
                    $set: {
                        status: data.object.status,
                    },
                },
                { returnDocument: "after" }
            );
            res.sendStatus(200);
        } catch (error) {
            console.log(error);
            res.sendStatus(500);
        }
    }
};

export const remove = async (req, res) => {
    try {
        Payment.findOneAndDelete(
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