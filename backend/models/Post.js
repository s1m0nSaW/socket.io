import mongoose from "mongoose";

const PostSchema = new mongoose.Schema({
    text:{
        type: String,
        required: true,
    },
    date:{
        type: Number,
        required: true,
    },
    positive:[],
    negative:[],
},{
    timestamps:true,
},
);

export default mongoose.model('Post', PostSchema);