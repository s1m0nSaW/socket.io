import mongoose from "mongoose";

const PartnerSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
    },
    phone:{
        type: String,
        required: true,
    },
    mail:{
        type: String,
        required: true,
    },
    status:{
        type: String,
        required: true,
    },
    shopName:{
        type: String,
        required: true,
    },
    city:{
        type: String,
        required: true,
    },
    product:{
        type: String,
        required: true,
    },
    count:{
        type: String,
        required: true,
    },
    website:{
        type: String,
        default: 'нет сайта',
    },
},{
    timestamps:true,
},
);

export default mongoose.model('Partner', PartnerSchema);