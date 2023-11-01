import mongoose from "mongoose";

const PaymentSchema = new mongoose.Schema({
    paymentId:{
        type: String,
        required: true,
    },
    paymentStatus:{
        type: String,
        required: true,
    },
    user:{
        type: String,
        required: true,
    }
},{
    timestamps:true,
},
);

export default mongoose.model('Payment', PaymentSchema);