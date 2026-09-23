import Message from "../models/message.models.js";

// SAVE MESSAGE
export const saveMessage = async (req, res) => {
    try {
        const { sender, receiver, text } = req.body;

        const newMessage = await Message.create({
            sender,
            receiver,
            text,
        });

        res.status(201).json(newMessage);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// GET CHAT BETWEEN TWO USERS
export const getMessages = async (req, res) => {
    try {
        const { senderId, receiverId } = req.params;

        const messages = await Message.find({
            $or: [
                { sender: senderId, receiver: receiverId },
                { sender: receiverId, receiver: senderId },
            ],
        }).sort({ createdAt: 1 });

        res.json(messages);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};