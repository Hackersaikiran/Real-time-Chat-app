const User = require("../models/user");

const getAuthUser = async (req, res) => {
	if (!req.user) {
		return res.status(404).json({ message: `User Not Found` });
	}
	res.status(200).json({
		data: req.user,
	});
};

const getAllUsers = async (req, res) => {
	const allUsers = await User.find({ _id: { $ne: req.user._id } })
		.select("-password")
		.sort({ _id: -1 });
	res.status(200).send({ data: allUsers });
};

const updateProfile = async (req, res) => {
	try {
		const { firstName, lastName, image } = req.body;
		const userId = req.user._id;

		// Validate input
		if (!firstName?.trim() || !lastName?.trim()) {
			return res.status(400).json({ message: "First and last name are required" });
		}

		// Update user profile
		const updateData = {
			firstName: firstName.trim(),
			lastName: lastName.trim(),
		};

		if (image) {
			updateData.image = image;
		}

		const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
			new: true,
		}).select("-password");

		if (!updatedUser) {
			return res.status(404).json({ message: "User not found" });
		}

		return res.status(200).json({
			message: "Profile updated successfully",
			data: updatedUser,
		});
	} catch (error) {
		console.error("Error updating profile:", error);
		return res.status(500).json({ message: "Failed to update profile" });
	}
};

module.exports = { getAuthUser, getAllUsers, updateProfile };
