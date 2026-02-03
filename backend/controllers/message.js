const Chat = require("../models/chat");
const Message = require("../models/message");

const createMessage = async (req, res) => {
	const { message, chatId, image } = req.body;
	
	// Either message or image must be provided
	if (!message?.trim() && !image) {
		return res.status(400).json({ message: "Message or image is required" });
	}

	try {
		const messageData = {
			sender: req.user._id,
			chat: chatId,
		};

		if (message?.trim()) {
			messageData.message = message.trim();
		}

		if (image) {
			messageData.image = image;
		}

		const newMessage = await Message.create(messageData);
		const chat = await Chat.findByIdAndUpdate(chatId, {
			latestMessage: newMessage._id,
		});
		const fullMessage = await Message.findById(newMessage._id)
			.populate("sender", "-password")
			.populate({
				path: "chat",
				populate: { path: "users groupAdmin", select: "-password" },
			});
		return res.status(201).json({ data: fullMessage });
	} catch (error) {
		console.error("Error creating message:", error);
		return res.status(500).json({ message: "Failed to create message" });
	}
};

const allMessage = async (req, res) => {
	const chatId = req.params.chatId;
	const messages = await Message.find({ chat: chatId })
		.populate("sender", "-password")
		.populate("chat");
	return res.status(200).json({ data: messages });
};
const clearChat = async (req, res) => {
	const chatId = req.params.chatId;
	await Message.deleteMany({ chat: chatId });
	return res.status(200).json({ message: "success" });
};

module.exports = { createMessage, allMessage, clearChat };
