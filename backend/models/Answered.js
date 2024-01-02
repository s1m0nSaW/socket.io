import mongoose from "mongoose";

const AnsweredSchema = new mongoose.Schema({
    questionId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Question"
    },
    gameId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Game"
    },
    turn: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: "User" 
    },
    user1: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: "User" 
    },
    user2: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: "User" 
    },
    answer1: {
        type: String,
        default: 'none',
    },
    answer2: {
        type: String,
        default: 'none',
    }
},{
    timestamps:true,
},
);

export default mongoose.model('Answered', AnsweredSchema);