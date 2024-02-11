import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    email:{
        type: String,
        required: true,
        unique: true,
    },
    passwordHash:{
        type: String,
        required: true,
    },
    nickname:{
        type: String,
        unique: true,
        required: true,
    },
    pic:{
        type: String,
        default: 'none',
    },
    profileStatus:{
        type: String,
        default: 'none',
    },
    fullname:{
        type: String,
        default: 'none',
    },
    age:{
        type: String,
        default: 'none',
    },
    gender:{
        type: String,
        default: 'none',
    },
    city:{
        type: String,
        default: 'none',
    },
    status:{
        type: String,
        default: 'none',
    },
    statusDate:{
        type: Number,
        default: 0,
    },
    invited:{
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
        default: 3,
    },
    rsvpDate:{
        type: Number,
        default: 0,
    },
    raisedmoney:{
        type: Number,
        default: 0,
    },
    promoter:{ type: mongoose.Schema.Types.ObjectId, default:'none', ref: "User" },
    friends:[{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    reqIn:[{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    reqOut:[{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    games:[{ type: mongoose.Schema.Types.ObjectId, ref: "Game" }],
    gamesIn:[{ type: mongoose.Schema.Types.ObjectId, ref: "Game" }],
    gamesOut:[{ type: mongoose.Schema.Types.ObjectId, ref: "Game" }],
},{
    timestamps:true,
},
);

export default mongoose.model('User', UserSchema);