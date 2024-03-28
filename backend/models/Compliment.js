import mongoose from "mongoose";

const ComplimentSchema = new mongoose.Schema({
    from: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: "User" 
    },
    to: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: "User" 
    },
    price: {
        type: Number,
        default: 0,
    },
    image: {
        type: String,
        default: 'none',
    },
    name: {
        type: String,
        default: 'none',
    },
},{
    timestamps:true,
},
);

export default mongoose.model('Compliment', ComplimentSchema);