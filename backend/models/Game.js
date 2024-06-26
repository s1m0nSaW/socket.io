import mongoose from "mongoose";

const GameSchema = new mongoose.Schema({
    gameName: { 
        type: String, 
        trim: true 
    },
    quiz:{
        type: Boolean,
        default: false,
    },
    activeStep:{
        type: Number,
        default: 0,
    },
    answered: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Question"
    },
    turn: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User"
    },
    theme: { 
        type: String,
        default: 'none',
    },
    forSponsor:{
        type: Boolean,
        default: false,
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
    user1vkid:{
        type: Number,
        default: 0,
    },
    user2vkid:{
        type: Number,
        default: 0,
    },
    userUrl1: { 
        type: String,
        default: 'none', 
    },
    userUrl2: { 
        type: String,
        default: 'none',
    },
},{
    timestamps:true,
},
);

export default mongoose.model('Game', GameSchema);