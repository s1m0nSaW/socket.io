import GameModel from "../models/Game.js";
import QuestionModel from "../models/Question.js";
import UserModel from "../models/User.js";
import AnsweredModel from "../models/Answered.js";
import MessageModel from "../models/Message.js";

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
                const answered = await AnsweredModel.findOne({ questionId: game.answered });
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
        await game.save();

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

            io.to(gameId).emit("answered", { data: answered});
            io.to(gameId).emit("updatedGame", { data: game});
        }
    } catch (err) {
        console.log(err);
    }
};