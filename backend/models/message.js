const mongoose = require("mongoose");

const messageSchema = mongoose.Schema(
	{
		sender: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		message: {
			type: String,
			trim: true,
		},
		image: {
			type: String,
			default: null,
		},
		chat: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Chat",
			required: true,
		},
	},
	{
		timestamps: true,
	}
);

const Message = mongoose.model("Message", messageSchema);

module.exports = Message;
