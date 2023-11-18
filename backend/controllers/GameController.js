import GameModel from '../models/Game.js';
import UserModel from '../models/User.js';

export const create = async (req,res) => {
    try {
        const doc = new GameModel({
            gameName: req.body.gameName,
            theme: req.body.theme,
            turn: null,
            user1: req.userId,
            user2: req.body.user2,
        });

        const game = await doc.save();

        UserModel.findById(req.userId)
        .then(user1 => {
            // Добавление идентификатор2 в поле gameIn первого пользователя
            user1.gamesOut.push(game._id);
            return user1.save();
        })
        .then(savedUser1 => {
            console.log(`Пользователь ${savedUser1._id} успешно обновлен.`);
            // Получение данных второго пользователя
            return UserModel.findById(req.body.user2);
        })
        .then(user2 => {
            // Добавление идентификатор1 в поле gameOut второго пользователя
            user2.gamesIn.push(game._id);
            return user2.save();
        })
        .then(savedUser2 => {
            console.log(`Пользователь ${savedUser2._id} успешно обновлен.`);
        })
        .catch(error => {
            console.error(error);
        });

        res.json(game);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось создать чат',
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
                message: "Чат не найден",
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
        GameModel.findOneAndUpdate({ _id: req.params.id }, { turn: req.body.userId }, { new: true }).catch(error => {
            console.log(error);
            res.status(500).json({ error: 'Something went wrong' });
        });

        res.json({
            success: true,
        });
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
              
                console.log('Пользователь 1 успешно обновлен:');
            });
    
            UserModel.findByIdAndUpdate(game.user2, { $pull: { games: game._id } }, { new: true }, (err, user1) => {
                if (err) {
                    console.log('Произошла ошибка при обновлении пользователя 1:', err);
                    return;
                }
              
                console.log('Пользователь 1 успешно обновлен:');
            });
        } else {
            UserModel.findByIdAndUpdate(game.user1, { $pull: { gameOut: game._id } }, { new: true }, (err, user1) => {
                if (err) {
                    console.log('Произошла ошибка при обновлении пользователя 1:', err);
                    return;
                }
              
                console.log('Пользователь 1 успешно обновлен:');
            });
    
            UserModel.findByIdAndUpdate(game.user2, { $pull: { gameIn: game._id } }, { new: true }, (err, user1) => {
                if (err) {
                    console.log('Произошла ошибка при обновлении пользователя 1:', err);
                    return;
                }
              
                console.log('Пользователь 1 успешно обновлен:');
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
                res.json({
                    success: "Игра удалена"
                });
            }
        );

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Проблема с удалением игры',
        });
    }
}