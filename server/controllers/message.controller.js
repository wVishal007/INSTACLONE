import {conversation} from '../models/conversation.model.js'
import { Message } from '../models/message.model.js';
import { getRecieverSocketID } from '../socket/socket.js';
import { io } from '../socket/socket.js';
export const sendMessage = async (req, res) => {
    try {
        const senderID = req.id;
        const recieverID = req.params.id;
        const { message } = req.body;
        console.log(Message);
        

        let Conversation = await conversation.findOne({
            participants: { $all: [senderID, recieverID] }
        })

        if (!Conversation) {
            Conversation = await conversation.create({
                participants: [senderID, recieverID]
            })
        }

        const newMessage = await Message.create({
            senderID,
            recieverID,
            message
        })
        if(newMessage){
            await Conversation.messages.push(newMessage._id)

        }
        
        await Promise.all([Conversation.save(),newMessage.save()]);

        const recieverSocketID = getRecieverSocketID(recieverID)
        if(recieverSocketID){
            io.to(recieverSocketID).emit('newMessage',newMessage)
        }

        return res.status(200).json({
            newMessage,
            success:true,
            confirmation:'message sent'
        })

        
    } catch (error) {
        console.log(error)
    }
}

export const getMessage = async (req, res) => {
    try {
        const senderID = req.id;
        const recieverID = req.params.id;

        // Await the database call
        const Conversation = await conversation.findOne({
            participants: { $all: [senderID, recieverID] }
        }).populate({
            path: "messages",
            options: { sort: { createdAt: 1 } } // sort by timestamp if timestamps are enabled
        });

        // If no conversation found
        if (!Conversation) {
            return res.status(200).json({
                messages: [],
                success: true
            });
        }

        // Return messages
        console.log(Conversation.messages);
        
        return res.status(200).json({
            success: true,
            messages: Conversation.messages,
            letter: 'it’s working here'
        });

    } catch (error) {
        console.error("Error in getMessage:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};