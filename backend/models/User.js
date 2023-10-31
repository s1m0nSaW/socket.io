import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    nickname:{
        type: String,
        unique: true,
        required: true,
    },
    fullname:{
        type: String,
        required: true,
    },
    age:{
        type: String,
        required: true,
    },
    gender:{
        type: String,
        required: true,
    },
    requisites:{
        userName:{
            type: String,
        },
        cardNumber:{
            type: String,
            minlength: 16,
            maxlength: 16,
            match: /^[0-9]{16}$/,
        },
        inn: String,
        bankName: String,
        bankNumber: String,
        bankBik: String,
        bankCorNumber: String,
    },
    email:{
        type: String,
        required: true,
        unique: true,
    },
    partner:{
        type: String,
        default: 'no',
    },
    balance:{
        type: Number,
        default: 0,
    },
    passwordHash:{
        type: String,
        required: true,
    },
    paymentId:{
        type: String,
        default: 'none',
    },
    paymentStatus:{
        type: String,
        default: 'none',
    },
    date:{
        type: Number,
        default: 0,
    },
    leader1:{
        type: String,
        default: 'none',
    },
    leader2:{
        type: String,
        default: 'none',
    },
    leader3:{
        type: String,
        default: 'none',
    },
    leader4:{
        type: String,
        default: 'none',
    },
    leader5:{
        type: String,
        default: 'none',
    },
    inviteds:[{
        id: {
            type: String,
            required: true,
        },
        date: {
            type: Number,
            required: true,
        },
        step: {
            type: String,
            required: true,
        }
    }],
    friends:[],
    purchases:[],
},{
    timestamps:true,
},
);

export default mongoose.model('User', UserSchema);