import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    vkid:{
        type: Number,
        required: true,
        unique: true,
    },
    status:{
        type: String,
        default: 'none',
    },
    statusDate:{
        type: Number,
        default: 0,
    },
    createGamesCount:{
        type: Number,
        default: 0,
    },
    rsvp:{
        type: Number,
        default: 0,
    },
    rsvpStatus:{
        type: Boolean,
        default: false,
    },
    dailyRsvp:{
        type: Number,
        default: 1,
    },
    rsvpDate:{
        type: Number,
        default: 0,
    },
    games:[{ type: mongoose.Schema.Types.ObjectId, ref: "Game" }],
    gamesIn:[{ type: mongoose.Schema.Types.ObjectId, ref: "Game" }],
    gamesOut:[{ type: mongoose.Schema.Types.ObjectId, ref: "Game" }],
},{
    timestamps:true,
},
);

export default mongoose.model('User', UserSchema);