import mongoose from "mongoose";

const ItemSchema = new mongoose.Schema({
    item:{    //id товара в приложении
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
    type:{
        type: String,
        required: true,
    },
    count:{
        type: Number,
        required: true,
    }
},{
    timestamps:true,
},
);

export default mongoose.model('Item', ItemSchema);