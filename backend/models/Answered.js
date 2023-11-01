import mongoose from "mongoose";

const AnsweredSchema = new mongoose.Schema({
    questionId: { 
        type: String,
        default: 'none',
    },
    gameId: { 
        type: String,
        default: 'none', 
    },
    userId: { 
        type: String,
        default: 'none', 
    },
    answer: {
        type: String,
        default: 'none',
    }
},{
    timestamps:true,
},
);

export default mongoose.model('Answered', AnsweredSchema);