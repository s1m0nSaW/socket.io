import GameModel from '../models/Game.js';
import UserModel from '../models/User.js';

export const create = async (req,res) => {
    try {
        const doc = new GameModel({
            gameName: req.body.gameName,
            user1: req.body.user1,
            user2: req.body.user2,
        });

        const game = await doc.save();

        await UserModel.updateOne(
            {
                _id: req.body.user1,
            },
            {
                $push: {
                    gamesOut: game._id,
                },
            },
            (err) => {
                if(err) console.log(err)
            }
        );
        
        await UserModel.updateOne(
            {
                _id: req.body.user2,
            },
            {
                $push: {
                    gamesIn: game._id,
                },
            },
            (err) => {
                if(err) console.log(err)
            }
        );

        res.json(game);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось создать чат',
        });
    }
};

export const getMyGames = async (req, res) => {
    try {
        const games = await GameModel.find({ user1: req.userId, });

        if (!games) {
            return res.status(404).json({
                message: "Игры не найдены",
            });
        }

        res.json(games);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Нет доступа",
        });
    }
};

export const getAppGames = async (req, res) => {
    try {
        const games = await GameModel.find({ user2: req.userId });

        if (!games) {
            return res.status(404).json({
                message: "Игры не найдены",
            });
        }

        res.json(games);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Нет доступа",
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
        const game = await GameModel.findOneAndUpdate(
            {
                _id: req.body.gameId,
            },
            {
                $set: {
                    status: 'active',
                },
            },
            (err) => {
                if(err) console.log(err)
            },
            { returnDocument: "after" }
        );

        if (!game) {
            return res.status(404).json({
                message: "Чат не найден",
            });
        } else {
            await UserModel.updateOne(
                {
                    _id: game.user1,
                },
                {
                    $pull: {
                        gamesOut: game._id,
                    },
                    $push: {
                        games: game._id,
                    },
                },
                (err) => {
                    if(err) console.log(err)
                }
            );

            await UserModel.updateOne(
                {
                    _id: game.user2,
                },
                {
                    $pull: {
                        gamesIn: game._id,
                    },
                    $push: {
                        games: game._id,
                    },
                },
                (err) => {
                    if(err) console.log(err)
                }
            );

            res.json(game);
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
        GameModel.findOneAndDelete(
            {
                _id: req.params.id,
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