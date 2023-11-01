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
    rsvp:{
        type: Number,
        default: 0,
    },
    dailyRsvp:{
        type: Number,
        default: 3,
    },
    friends:[],
    reqIn:[],
    reqOut:[],
    games:[],
    gamesIn:[],
    gamesOut:[],
},{
    timestamps:true,
},
);

export default mongoose.model('User', UserSchema);