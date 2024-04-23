import GameModel from "../models/Game.js";
import QuestionModel from "../models/Question.js";
import UserModel from "../models/User.js";
import AnsweredModel from "../models/Answered.js";
import MessageModel from "../models/Message.js";
import RatingModel from "../models/Rating.js";
import ComplimentModel from "../models/Compliment.js";

export const getGame = async ( io, vkid, gameId ) => {
    try {
        const game = await GameModel.findById(gameId);

        if (game) {
            const questions = await QuestionModel.find({ theme: game.theme, });
            let user1 = await UserModel.findById(game.user1)
            let user2 = await UserModel.findById(game.user2)
            const messages = await MessageModel.find({ gameId: game._id });
            if( vkid === user1.vkid ){
                io.to(vkid).emit("playingGame", { data: {
                    user: user1,
                    friend: user2, 
                } });
            } else {
                io.to(vkid).emit("playingGame", { data: {
                    user: user2,
                    friend: user1, 
                } });
            }
            if(game.activeStep === 0){
                if(game.turn !== null) {
                    const doc = new AnsweredModel({
                        questionId: questions[0]._id,
                        gameId: game._id,
                        turn: game.turn,
                        user1: game.user1,
                        user2: game.user2,
                        answer1: 'none',
                        answer2: 'none',
                    });
                    const answered = await doc.save();
                    io.to(vkid).emit("answered", { data: answered});
                }
            } else {
                const answered = await AnsweredModel.findOne({ _id: game.answered });
                io.to(vkid).emit("answered", { data: answered});
            }
            io.to(vkid).emit("updatedGame", { data: game});
            io.to(vkid).emit("questions", { data: questions});
            io.to(vkid).emit("gameMessages", { data: messages.reverse()});
        }
    } catch (err) {
        console.log(err);
    }
};

export const setTurn = async (io, userId, gameId) => {
    try {
        const game = await GameModel.findOneAndUpdate({ _id: gameId }, { turn: userId }, { new: true }).catch(error => {
            console.log(error);
        });
        io.to(gameId).emit("updatedGame", { data: game});
        if(game) {
            const questions = await QuestionModel.find({ theme: game.theme, });
            const doc = new AnsweredModel({
                questionId: questions[0]._id,
                gameId: game._id,
                turn: userId,
                user1: game.user1,
                user2: game.user2,
                answer1: 'none',
                answer2: 'none',
            });
            const answered = await doc.save();
            io.to(gameId).emit("answered", { data: answered});
        }

    } catch (err) {
        console.log(err);
    }
}

export const nextStep = async ( io, userId, gameId ) => {
    try {
        const game = await GameModel.findById(gameId);
        game.activeStep += 1;
        if (game) {
            const questions = await QuestionModel.find({ theme: game.theme, });
            
            const doc = new AnsweredModel({
                questionId: questions[game.activeStep]._id,
                gameId: game._id,
                turn: userId,
                user1: game.user1,
                user2: game.user2,
                answer1: 'none',
                answer2: 'none',
            });
            const answered = await doc.save();
            game.answered = answered._id
            await game.save();

            io.to(gameId).emit("answered", { data: answered});
            io.to(gameId).emit("updatedGame", { data: game});
        }
    } catch (err) {
        console.log(err);
    }
};

export const theEnd = async ( io, gameId, theme ) => {
    const rating = await RatingModel.findOne({ theme: theme });
    const answereds = await AnsweredModel.find({ gameId: gameId });
    io.to(gameId).emit("onTheEnd", { data: { rating, answereds }});
}

export const updateRating = async (io, ratingId, rate, gameId) => {
    try {
        const rating = await RatingModel.findById(ratingId);

        if(rating){
            let newRating = Math.ceil((rate + (rating.rating * rating.count))/(rating.count + 1));
            rating.rating = newRating;
            rating.count += 1;
            rating.games.push(gameId); 
            await rating.save();

            const answereds = await AnsweredModel.find({ gameId: gameId });
            io.to(gameId).emit("onTheEnd", { data: { rating, answereds }});
        }

    } catch (error) {
        console.log(error);
    }
};

export const createCompliment = async (io, from, to, price, image, name) => {
    try {
        let fromUser = await UserModel.findById(from)
        let toUser = await UserModel.findById(to)

        const doc = new ComplimentModel({
            from: from,
            to: to,
            price: price,
            image: image,
            name: name,
        });

        const compliment = await doc.save();

        if(compliment){
            io.to(toUser.vkid).emit("notification", { data: { message: `${fromUser.firstName} подарил вам комплимент`, severity:'success' } });
            io.to(fromUser.vkid).emit("notification", { data: { message: `Комплимент успешно подарен`, severity:'success' } });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Не удалось создать compliment",
        });
    }
}