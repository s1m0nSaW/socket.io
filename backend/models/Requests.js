import mongoose from "mongoose";

const RequestSchema = new mongoose.Schema({
    amount:{
        type: Number,
        required: true,
    },
    userId:{
        type: String,
        required: true,
    },
    date:{
        type: Number,
        required: true,
    },
    status:{
        type: String,
        default: 'Принята к исполнению'
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
        inn: Number,
        bankName: String,
        bankNumber: Number,
        bankBik: Number,
        bankCorNumber: Number,
    },
},{
    timestamps:true,
},
);

export default mongoose.model('Request', RequestSchema);