import Message from '../models/message.model.js';
import Conversation from '../models/conversation.model.js';
import { asyncHandler } from '../utilities/asyncHandler.utility.js';
import { errorHandler } from '../utilities/errorHandler.utility.js';
import { io } from '../socket/socket.js';
import { getSocketId } from '../socket/socket.js';
import { Socket } from 'socket.io';


export const sendMessage = asyncHandler(async (req, res, next) => {
    const senderId = req.user._id;
    const receiverId = req.params.receiverId;
    const message = req.body.message;

    if (!senderId || !receiverId || !message) {
        return next(new errorHandler('All fields are required', 400));
    }

    let conversation = await Conversation.findOne({
        participants: { $all: [senderId, receiverId] },
    });

    if (!conversation) {
        conversation = await Conversation.create({
            participants: [senderId, receiverId],
        });
    }

    const newMessage = await Message.create({
        sender: senderId,
        receiver: receiverId,
        message: message,
    });

    if (newMessage) {
        conversation.messages.push(newMessage._id);
        await conversation.save();
    }

    // socket.io
    const socketId = getSocketId(receiverId);
    io.to(socketId).emit('newMessage', newMessage);

    res.status(200).json({
        success: true,
        responseData: newMessage,
    });
});


export const getMessage = asyncHandler(async (req, res, next) => {
    const myId = req.user._id;
    const participantId = req.params.participantId;

    if (!myId || !participantId) {
        return next(new errorHandler('All fields are required', 400));
    }

    let conversation = await Conversation.findOne({
        participants: { $all: [myId, participantId] },
    }).populate('messages');
    

    res.status(200).json({
        success: true,
        responseData: conversation,
    });
});
