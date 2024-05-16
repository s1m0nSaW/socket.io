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
    key:{
        type: String,
        required: true,
    },
    title:{
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    image: {
        type: String,
        default: 'none',
    },
    name: {
        type: String,
        default: 'none',
    },
    active: {
        type: Boolean,
        default: false,
    }
},{
    timestamps:true,
},
);

export default mongoose.model('Compliment', ComplimentSchema);