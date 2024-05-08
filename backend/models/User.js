import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    vkid:{
        type: Number,
        required: true,
        unique: true,
    },
    firstName:{
        type: String,
        default: 'no name',
    },
    avaUrl:{
        type: String,
        default: 'no url',
    },
    status:{
        type: String,
        default: 'firstTime',
    },
    statusDate:{
        type: Number,
        default: 0,
    },
    createGamesCount:{
        type: Number,
        default: 0,
    },
    ads:{
        type: Number,
        default: 0,
    },
    adsDate:{
        type: Number,
        default: 0,
    },
    adsStatus:{
        type: Boolean,
        default: true,
    },
    rsvp:{
        type: Number,
        default: 1,
    },
    rsvpStatus:{
        type: Boolean,
        default: true,
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