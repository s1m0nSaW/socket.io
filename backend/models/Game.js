import mongoose from "mongoose";

const GameSchema = new mongoose.Schema({
    gameName: { 
        type: String, 
        trim: true 
    },
    status: { 
        type: String,
        default: 'inactive', 
    },
    user1: { 
        type: String,
        default: 'none', 
    },
    user2: { 
        type: String,
        default: 'none', 
    },
},{
    timestamps:true,
},
);

export default mongoose.model('Game', GameSchema);