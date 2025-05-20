import mongoose from "mongoose";
const postSchema = new mongoose.Schema({
    caption : {type:String,default:''},

    image:{type:String,required:true},

    author :{type:mongoose.Schema.Types.ObjectId,ref:'user',required:true},

    likes:[{type:mongoose.Schema.Types.ObjectId,ref:'user'}],

    likes:[{type:mongoose.Schema.Types.ObjectId,ref:'user'}],

    comments:[{type:mongoose.Schema.Types.ObjectId,ref:'comment'}]

},{
    timestamps:true
});

export const Post = mongoose.model('Post',postSchema); 