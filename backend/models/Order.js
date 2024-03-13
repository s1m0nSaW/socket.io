import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema({
    item:{                     //Идентификатор товара, который в приложении.
        type: String,
        required: true,
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
        required: true,
    },
    app_order_id:{
        type: Number,
        required: true,
    }
},{
    timestamps:true,
},
);

export default mongoose.model('Order', OrderSchema);