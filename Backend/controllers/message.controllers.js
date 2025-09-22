
import { uploadOnCloudinary } from "../config/cloudinary.js";
import Conversation from "../models/conversation.model.js";
import Message from "../models/messages.mode.js";
import { getSocketId, io } from "../socket.js";


export const sendMessage = async (req, res) => {
    try {
        const senderId = req.userId
        const reciverId = req.params.reciverId
        const { message } = req. body

        let image;
        if( req.file ){
            image = await uploadOnCloudinary(req.file.path)
        }

        const NewMessage  = await Message.create({
            sender : senderId,
            reciver : reciverId,
            message,
            image
        })

        let conversation = await Conversation.findOne({
            participants:{$all:[senderId, reciverId]}
        })
        if(!conversation){
            conversation = await Conversation.create({
                participants:[senderId, reciverId],
                messages : [NewMessage._id]
            })
        }else {
            conversation.messages.push(NewMessage._id)
            await conversation.save()
        }

        const receiverSocketId = getSocketId(reciverId)
        
        if(receiverSocketId){
            io.to(receiverSocketId).emit("NewMessage", NewMessage)
        }

        return res.status(200).json(NewMessage)

    } catch (error) {
        return res.status(500).json({message : `send messsage error ${error}`})
    }
}


export const getAllMessages = async (req, res) => {
    try {
        const senderId = req.userId
        const reciverId = req.params.reciverId
        const conversation = await Conversation.findOne({participants:{$all:[senderId, reciverId]}}).populate("messages")
        return res.status(200).json(conversation?.messages)
    } catch (error) {
        return res.status(500).json({message : `get all messsage error ${error}`})
    }
}

export const getPrevUserChat = async ( req, res) => {
    try {
        const currentUserId = req.userId
        const conversations = await Conversation.find({
            participants:currentUserId
        }).populate("participants").sort({updatedAt:-1})

        const userMap = {}

        conversations.forEach(conv => {
            conv.participants.forEach((user) => {
                if(user._id != currentUserId){
                    userMap[user._id] = user
                }
            })
        });

        const  previousUsers = Object.values(userMap)
        return res.status(200).json(previousUsers)

    } catch (error) {
        
    }
}