import GameModel from '../models/Game.js';
import UserModel from '../models/User.js';
import RatingModel from '../models/Rating.js';
import AnsweredModel from '../models/Answered.js';
import MessageModel from '../models/Message.js';
import StatModel from '../models/Stat.js';

const updateStat = async (user_id) => {
    const today = new Date(); // Получаем текущую дату
    today.setHours(0, 0, 0, 0); // Устанавливаем время в полночь
    StatModel.findOne({ date: today }, (err, stat) => {
        if (err) {
            console.error('Ошибка при поиске статистики:', err);
        } else {
            if (stat) {
                // Нашли объект статистики для сегодняшней даты
                // Теперь мы можем вносить изменения
                stat.newGames.push(user_id); // Добавляем новую строку в массив strings
                // stat.numbers.push(42); // Добавляем число 42 в массив numbers

                // Сохраняем изменения в базе данных
                stat.save();
            } else {
                // Объект статистики для сегодняшней даты не найден, создаем новый объект статистики
                const newStatistic = new StatModel({
                    date: today,
                    newGames: [user_id],
                    // numbers: [42],
                });

                // Сохраняем новый объект статистики в базе данных
                newStatistic.save();
            }
        }
    });
}

export const create = async (req,res) => {
    try {
        const user = await UserModel.findById(req.userId);
        const rating = await RatingModel.findOne({ theme: req.body.theme });

        if (user.status === 'sponsor'){
            if (user.dailyRsvp > 0) {
                const doc = new GameModel({
                    gameName: req.body.gameName,
                    theme: req.body.theme,
                    turn: null,
                    user1: req.userId,
                    user2: req.body.user2,
                });
        
                const game = await doc.save();
                updateStat(user._id);
        
                UserModel.findById(req.userId)
                .then(user1 => {
                    // Добавление идентификатор2 в поле gameIn первого пользователя
                    user1.gamesOut.push(game._id);
                    user1.dailyRsvp -= 1;
                    user1.createGamesCount += 1;
                    return user1.save();
                })
                .then(savedUser1 => {
                    // Получение данных второго пользователя
                    return UserModel.findById(req.body.user2);
                })
                .then(user2 => {
                    // Добавление идентификатор1 в поле gameOut второго пользователя
                    user2.gamesIn.push(game._id);
                    return user2.save();
                })
                .catch(error => {
                    console.error(error);
                });
        
                res.json(game);
            } else if (user.rsvp > 0) {
                const doc = new GameModel({
                    gameName: req.body.gameName,
                    theme: req.body.theme,
                    turn: null,
                    user1: req.userId,
                    user2: req.body.user2,
                });
        
                const game = await doc.save();
                updateStat(user._id);
        
                UserModel.findById(req.userId)
                .then(user1 => {
                    // Добавление идентификатор2 в поле gameIn первого пользователя
                    user1.gamesOut.push(game._id);
                    user1.rsvp -= 1;
                    user1.createGamesCount += 1;
                    return user1.save();
                })
                .then(savedUser1 => {
                    // Получение данных второго пользователя
                    return UserModel.findById(req.body.user2);
                })
                .then(user2 => {
                    // Добавление идентификатор1 в поле gameOut второго пользователя
                    user2.gamesIn.push(game._id);
                    return user2.save();
                })
                .catch(error => {
                    console.error(error);
                });
        
                res.json(game);
            } else {
                res.status(500).json({
                    message: 'Недостаточно rsvp',
                });
            }
        } else {
            if(rating.forSponsor){
                res.status(500).json({
                    message: 'Не удалось создать игру',
                });
            } else {
                if (user.dailyRsvp > 0) {
                    const doc = new GameModel({
                        gameName: req.body.gameName,
                        theme: req.body.theme,
                        turn: null,
                        user1: req.userId,
                        user2: req.body.user2,
                    });
            
                    const game = await doc.save();
                    updateStat(user._id);
            
                    UserModel.findById(req.userId)
                    .then(user1 => {
                        // Добавление идентификатор2 в поле gameIn первого пользователя
                        user1.gamesOut.push(game._id);
                        user1.dailyRsvp -= 1;
                        user1.createGamesCount += 1;
                        return user1.save();
                    })
                    .then(savedUser1 => {
                        // Получение данных второго пользователя
                        return UserModel.findById(req.body.user2);
                    })
                    .then(user2 => {
                        // Добавление идентификатор1 в поле gameOut второго пользователя
                        user2.gamesIn.push(game._id);
                        return user2.save();
                    })
                    .catch(error => {
                        console.error(error);
                    });
            
                    res.json(game);
                } else if (user.rsvp > 0) {
                    const doc = new GameModel({
                        gameName: req.body.gameName,
                        theme: req.body.theme,
                        turn: null,
                        user1: req.userId,
                        user2: req.body.user2,
                    });
            
                    const game = await doc.save();
                    updateStat(user._id);
            
                    UserModel.findById(req.userId)
                    .then(user1 => {
                        // Добавление идентификатор2 в поле gameIn первого пользователя
                        user1.gamesOut.push(game._id);
                        user1.rsvp -= 1;
                        user1.createGamesCount += 1;
                        return user1.save();
                    })
                    .then(savedUser1 => {
                        // Получение данных второго пользователя
                        return UserModel.findById(req.body.user2);
                    })
                    .then(user2 => {
                        // Добавление идентификатор1 в поле gameOut второго пользователя
                        user2.gamesIn.push(game._id);
                        return user2.save();
                    })
                    .catch(error => {
                        console.error(error);
                    });
            
                    res.json(game);
                } else {
                    res.status(500).json({
                        message: 'Недостаточно rsvp',
                    });
                }
            }
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось создать игру',
        });
    }
};

export const getGames = async (req, res) => {
    try {
        const gamesIds = req.body.games

        const games = await GameModel.find({ _id: { $in: gamesIds } });

        if (!games) {
            return res.status(404).json({
                message: "Не удалось найти игры",
            });
        }

        res.json(games);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Ошибка при поиске игр',
        });
    }
};

export const getGame = async (req, res) => {
    try {
        const chat = await GameModel.findById(req.params.id);

        if (!chat) {
            return res.status(404).json({
                message: "Игра не найдена",
            });
        }

        res.json(chat);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Нет доступа",
        });
    }
};

export const acceptGame = async (req, res) => {
    try {
        GameModel.findOneAndUpdate({ _id: req.params.id }, { status: 'active' }, { new: true })
            .then(game => {
                UserModel.findOneAndUpdate({ _id: game.user1 }, 
                                        { $push: { games: game._id }, $pull: { gamesOut: game._id } }, 
                                        { new: true })
                .then(user1 => {
                    UserModel.findOneAndUpdate({ _id: game.user2 }, 
                                            { $push: { games: game._id }, $pull: { gamesIn: game._id } }, 
                                            { new: true })
                    .then(user2 => {
                        res.json(game);
                    })
                    .catch(error => {
                        console.log(error);
                        res.status(500).json({ error: 'Something went wrong' });
                    });
                })
                .catch(error => {
                    console.log(error);
                    res.status(500).json({ error: 'Something went wrong' });
                });
            })
            .catch(error => {
                console.log(error);
                res.status(500).json({ error: 'Something went wrong' });
            });
        

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Нет доступа",
        });
    }
};

export const begin = async (req, res) => {
    try {
        const game = await GameModel.findOneAndUpdate({ _id: req.params.id }, { turn: req.body.userId }, { new: true }).catch(error => {
            console.log(error);
            res.status(500).json({ error: 'Something went wrong' });
        });

        if (!game) {
            return res.status(404).json({
                message: "Игра не найдена",
            });
        }

        res.json(game);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Ошибка при поиске игр',
        });
    }
};

export const update = async (req, res) => {
    try {
        const game = await GameModel.findOneAndUpdate({ _id: req.params.id }, { 
            activeStep: req.body.activeStep,
            answered: req.body.answeredId,
        }, { new: true }).catch(error => {
            console.log(error);
            res.status(500).json({ error: 'Something went wrong' });
        });

        if (!game) {
            return res.status(404).json({
                message: "Игра не найдена",
            });
        }

        res.json(game);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Ошибка при поиске игр',
        });
    }
};

export const removeGame = async (req, res) => {
    try {
        const game = await GameModel.findById(req.params.id);

        if(game.status === 'active') {
            UserModel.findByIdAndUpdate(game.user1, { $pull: { games: game._id } }, { new: true }, (err, user1) => {
                if (err) {
                    console.log('Произошла ошибка при обновлении пользователя 1:', err);
                    return;
                }
            });
    
            UserModel.findByIdAndUpdate(game.user2, { $pull: { games: game._id } }, { new: true }, (err, user1) => {
                if (err) {
                    console.log('Произошла ошибка при обновлении пользователя 1:', err);
                    return;
                }
            });
        } else {
            UserModel.findByIdAndUpdate(game.user1, { $pull: { gameOut: game._id } }, { new: true }, (err, user1) => {
                if (err) {
                    console.log('Произошла ошибка при обновлении пользователя 1:', err);
                    return;
                }
            });
    
            UserModel.findByIdAndUpdate(game.user2, { $pull: { gameIn: game._id } }, { new: true }, (err, user1) => {
                if (err) {
                    console.log('Произошла ошибка при обновлении пользователя 1:', err);
                    return;
                }
            });
        }

        GameModel.findOneAndDelete(
            {
                _id: game._id,
            },
            (err, doc) => {
                if (err) {
                    return res.status(500).json({
                        message: 'Не удалось удалить игру',
                    });
                }

                if (!doc) {
                    return res.status(404).json({
                        message: 'Игра не найдена'
                    });
                }

                MessageModel.deleteMany({ gameId: game._id }, (err, doc) => {
                    if (err) {
                        console.log("Не удалось удалить сообщения", game._id)
                    }
                    if (!doc) {
                        console.log("Сообщения не найдены", game._id)
                    }
                    console.log("Сообщения удалены", game._id)
                });
                AnsweredModel.deleteMany({ gameId: game._id }, (err, doc) => {
                    if (err) {
                        console.log("Не удалось удалить answereds", game._id)
                    }
                    if (!doc) {
                        console.log("answereds не найдены", game._id)
                    }
                    console.log("answereds удалены", game._id)
                });

                res.json({
                    success: "Игра удалена"
                });
            }
        );

    } catch (err) {
        console.warn(err);
        res.status(500).json({
            message: 'Проблема с удалением игры',
        });
    }
}