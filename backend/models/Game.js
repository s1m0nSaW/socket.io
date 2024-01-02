import mongoose from "mongoose";

const GameSchema = new mongoose.Schema({
    gameName: { 
        type: String, 
        trim: true 
    },
    activeStep:{
        type: Number,
        default: 0,
    },
    answered: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Answered"
    },
    turn: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User"
    },
    theme: { 
        type: String,
        default: 'none',
    },
    status: { 
        type: String,
        default: 'inactive', 
    },
    user1: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User" 
    },
    user2: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User" 
    },
},{
    timestamps:true,
},
);

export default mongoose.model('Game', GameSchema);