import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    senderID:{
        type:mongoose.Schema.Types.ObjectId,ref:'user'
    },
    recieverID:{
        type:mongoose.Schema.Types.ObjectId,ref:'user'
    },
    message:{
        type:String,required:true
    },
    PostMessage:{
        type:String,required:false
    }
});

export const Message = mongoose.model('Message',messageSchema)