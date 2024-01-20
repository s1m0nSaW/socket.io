import mongoose from "mongoose";

const QuestionSchema = new mongoose.Schema({
    theme: { 
        type: String, 
        default: 'none', 
    },
    text: {
        type: String,
        default: 'none',
    },
    answer1: {
        type: String,
        default: 'none',
    },
    answer2: { 
        type: String,
        default: 'none', 
    },
    answer3: { 
        type: String,
        default: 'none', 
    },
    answer4: { 
        type: String,
        default: 'none', 
    },
    sponsor: { 
        type: String,
        default: 'none', 
    },
    correct: { 
        type: String,
        default: 'none', 
    },
},{
    timestamps:true,
},
);

export default mongoose.model('Question', QuestionSchema);