import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({
    senderId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User" 
    },
    content: { 
        type: String,
    },
    gameId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Game" 
    },
},{
    timestamps:true,
},
);

export default mongoose.model('Message', MessageSchema);