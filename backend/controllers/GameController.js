import GameModel from '../models/Game.js';
import UserModel from '../models/User.js';
import RatingModel from '../models/Rating.js';
import AnsweredModel from '../models/Answered.js';
import MessageModel from '../models/Message.js';

export const create = async (req,res) => {
    try {
        const user = await UserModel.findById(req.userId);
        const rating = await RatingModel.findOne({ theme: req.body.theme });

        if (user.status === 'sponsor'){
            if (user.rsvp > 0) {
                const doc = new GameModel({
                    gameName: req.body.gameName,
                    theme: req.body.theme,
                    turn: req.body.turn,
                    forSponsor: req.body.forSponsor,
                    user1: req.userId, // создатель
                    user2: req.body.user2,
                    userUrl1: req.body.userUrl1, 
                    userUrl2: req.body.userUrl2,
                });
        
                const game = await doc.save();
        
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
        
                res.status(200).json(game);
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
                if (user.rsvp > 0) {
                    const doc = new GameModel({
                        gameName: req.body.gameName,
                        theme: req.body.theme,
                        turn: req.body.turn,
                        forSponsor: req.body.forSponsor,
                        user1: req.userId, // создатель
                        user2: req.body.user2,
                        userUrl1: req.body.userUrl1, 
                        userUrl2: req.body.userUrl2,
                    });
            
                    const game = await doc.save();
            
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
            
                    res.status(200).json(game);
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

        res.status(200).json(games);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Ошибка при поиске игр',
        });
    }
};

export const getAllGames = async (req, res) => {
    try {
        const games = await GameModel.find();

        if (!games) {
            return res.status(404).json({
                message: "Не удалось найти игры",
            });
        }

        res.status(200).json(games);
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

        res.status(200).json(chat);
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
                        res.status(200).json(game);
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

        res.status(200).json(game);
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

        res.status(200).json(game);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Ошибка при поиске игр',
        });
    }
};

export const removeGame = async (req, res) => {
    try {

        if(req.body.status === 'active') {
            let user1 = await UserModel.findById(req.body.user1)
            user1.games.pull(req.body.game); 
            await user1.save();

            let user2 = await UserModel.findById(req.body.user2)
            user2.games.pull(req.body.game);
            await user2.save();
        } else {
            let user1 = await UserModel.findById(req.body.user1)
            user1.gamesOut.pull(req.body.game); 
            await user1.save();

            let user2 = await UserModel.findById(req.body.user2)
            user2.gamesIn.pull(req.body.game);
            await user2.save();
        }

        MessageModel.deleteMany({ gameId: req.body.game }, (err, doc) => {
            if (err) {
                console.log("Не удалось удалить сообщения", req.body.game)
            }
            if (!doc) {
                console.log("Сообщения не найдены", req.body.game)
            }
            console.log("Сообщения удалены", req.body.game)
        });

        AnsweredModel.deleteMany({ gameId: req.body.game }, (err, doc) => {
            if (err) {
                console.log("Не удалось удалить answereds", req.body.game)
            }
            if (!doc) {
                console.log("answereds не найдены", req.body.game)
            }
            console.log("answereds удалены", req.body.game)
        });

        GameModel.findOneAndDelete(
            {
                _id: req.body.game,
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
            }
        );

        res.status(200).json({
            success: "Игра удалена"
        });

    } catch (err) {
        console.warn(err);
        res.status(500).json({
            message: 'Проблема с удалением игры',
        });
    }
}