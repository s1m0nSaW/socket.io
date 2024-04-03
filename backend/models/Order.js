import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema({
    item:{                     //Идентификатор товара, который в приложении.
        type: String,
        default: 'none',
    },
    item_id:{                     //Идентификатор проданного товара, который сгенерировал ВКонтакте.
        type: String,
        required: true,
    },
    order_id:{
        type: Number,
        required: true,
    },
    user_id: {
        type: Number,
        required: true,
    },
    receiver_id:{
        type: Number,
        default: 0,
    },
    app_order_id:{
        type: Number,
        required: true,
    },
    cancel_reason:{
        type: String,
        default: 'none',
    },
    type:{
        type: String,
        default: 'none',
    },
},{
    timestamps:true,
},
);

export default mongoose.model('Order', OrderSchema);