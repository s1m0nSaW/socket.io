import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({
    senderId: {
        type: String,
        default: 'none',
    },
    content: { 
        type: String,
    },
    gameId: { 
        type: String,
        default: 'none', 
    },
},{
    timestamps:true,
},
);

export default mongoose.model('Message', MessageSchema);