import AnsweredModel from '../models/Answered.js';

export const create = async ( io, questionId, gameId, turn, user1, user2, answer1, answer2 ) => {
    try {
        const doc = new AnsweredModel({
            questionId: questionId,
            gameId: gameId,
            turn: turn,
            user1: user1,
            user2: user2,
            answer1: answer1,
            answer2: answer2,
        });

        const answered = await doc.save();

        if(answered){
            io.to(gameId).emit("answered", { data: answered});
        }

    } catch (err) {
        console.log(err);
        io.to(gameId).emit("error", { data: 'Something went wrong', err});
    }
}

export const update = async ( io, id, answer2, correct, answer1, gameId) => {
    try {
        if(answer1 === 'none' ){
            const answered = await AnsweredModel.findOneAndUpdate({ questionId: id }, { 
                answer2: answer2,
                correct: correct,
            }, { new: true }).catch(error => {
                io.to(gameId).emit("error", { data: 'Something went wrong', error});
                console.log(error);
            });
            if(answered){
                io.to(gameId).emit("answered", { data: answered});
            }
        } else if (answer2 === 'none' ){
            const answered = await AnsweredModel.findOneAndUpdate({ questionId: id }, { 
                answer1: answer1,
                correct: correct,
            }, { new: true }).catch(error => {
                console.log(error);
                io.to(gameId).emit("error", { data: 'Something went wrong', error});
            });
            if(answered){
                io.to(gameId).emit("answered", { data: answered});
            }
        } else {
            io.to(gameId).emit("error", { data: 'Something went wrong'});
        }
    } catch (err) {
        console.log(err);
        io.to(gameId).emit("error", { data: 'Something went wrong', err});
    }
}

export const getAnwered = async ( gameId, answeredId ) => {
    try {
        const answered = await AnsweredModel.findOne({ questionId: answeredId });

        if (!answered) {
            io.to(gameId).emit("error", { data: "Ответов нет"});
        } else {
            io.to(gameId).emit("answered", { data: answered});
        }

    } catch (err) {
        console.log(err);
        io.to(gameId).emit("error", { data: "Нет доступа", err });
    }
};