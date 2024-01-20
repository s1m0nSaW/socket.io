import mongoose from "mongoose";

const RatingSchema = new mongoose.Schema({
    theme:{
        type: String,
        required: true,
    },
    count:{
        type: Number,
        default: 0,
    },
    rating:{
        type: Number,
        default: 0,
    },
    forSponsor:{
        type: Boolean,
        default: false,
    },
    games:[{ type: mongoose.Schema.Types.ObjectId, ref: "Game" }],
},{
    timestamps:true,
},
);

export default mongoose.model('Rating', RatingSchema);