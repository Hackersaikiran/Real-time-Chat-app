import React, { useRef, useState } from "react";
import { MdOutlineClose } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { setProfileDetail } from "../redux/slices/conditionSlice";
import { addAuth } from "../redux/slices/authSlice";
import { toast } from "react-toastify";

const ProfileDetail = () => {
	const dispatch = useDispatch();
	const user = useSelector((store) => store.auth);
	const [isEditing, setIsEditing] = useState(false);
	const [firstName, setFirstName] = useState(user?.firstName || "");
	const [lastName, setLastName] = useState(user?.lastName || "");
	const [profileImage, setProfileImage] = useState(user?.image || "");
	const [imagePreview, setImagePreview] = useState(user?.image || "");
	const fileInputRef = useRef(null);
	const [isSaving, setIsSaving] = useState(false);

	const convertToBase64 = (file) => {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.readAsDataURL(file);
			reader.onload = () => resolve(reader.result);
			reader.onerror = (error) => reject(error);
		});
	};

	const handleImageChange = async (e) => {
		const file = e.target.files?.[0];
		if (file) {
			try {
				const base64 = await convertToBase64(file);
				setImagePreview(base64);
				setProfileImage(base64);
			} catch (error) {
				toast.error("Failed to process image");
			}
		}
	};

	const handleUpdate = async () => {
		if (!firstName.trim() || !lastName.trim()) {
			toast.error("First and last name are required");
			return;
		}

		setIsSaving(true);
		const token = localStorage.getItem("token");

		try {
			const response = await fetch(
				`${import.meta.env.VITE_BACKEND_URL}/api/user/update-profile`,
				{
					method: "PUT",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
					body: JSON.stringify({
						firstName: firstName.trim(),
						lastName: lastName.trim(),
						image: profileImage !== user?.image ? profileImage : undefined,
					}),
				}
			);

			const data = await response.json();

			if (response.ok) {
				dispatch(addAuth(data.data));
				setIsEditing(false);
				toast.success("Profile updated successfully!");
			} else {
				toast.error(data.message || "Failed to update profile");
			}
		} catch (error) {
			console.error("Error:", error);
			toast.error("Error updating profile");
		} finally {
			setIsSaving(false);
		}
	};

	const handleCancel = () => {
		setFirstName(user?.firstName || "");
		setLastName(user?.lastName || "");
		setImagePreview(user?.image || "");
		setProfileImage(user?.image || "");
		setIsEditing(false);
	};

	return (
		<div className="flex -m-2 sm:-m-4 flex-col items-center my-6 text-slate-300 min-h-screen w-full fixed top-0 justify-center z-50">
			<div className="p-6 pt-8 w-[90%] sm:w-[70%] md:w-[60%] lg:w-[45%] min-w-72 max-w-[600px] border border-blue-400/50 bg-gradient-to-br from-slate-900 to-slate-950 rounded-2xl h-fit mt-5 transition-all relative shadow-2xl shadow-blue-500/20">
				<h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent w-full text-center mb-6">
					👤 Profile Settings
				</h2>

				<div className="w-full flex flex-col items-center gap-6">
					{/* Profile Image Section */}
					<div className="flex flex-col items-center gap-3">
						<img
							src={imagePreview}
							alt="profile"
							className="w-24 h-24 rounded-2xl border-2 border-blue-400/50 object-cover shadow-lg"
						/>
						{isEditing && (
							<button
								onClick={() => fileInputRef.current?.click()}
								className="px-4 py-2 rounded-lg bg-blue-500/30 border border-blue-400/50 text-blue-300 hover:bg-blue-500/50 transition-all text-sm font-semibold"
							>
								Change Photo
							</button>
						)}
						<input
							ref={fileInputRef}
							type="file"
							accept="image/png, image/jpg, image/gif, image/jpeg"
							onChange={handleImageChange}
							className="hidden"
						/>
					</div>

					{/* Profile Info Section */}
					{!isEditing ? (
						<div className="w-full space-y-4">
							<div className="bg-white/5 border border-blue-400/20 rounded-xl p-4">
								<label className="text-blue-300 text-sm font-semibold">First Name</label>
								<p className="text-white text-lg mt-2">{user?.firstName}</p>
							</div>

							<div className="bg-white/5 border border-blue-400/20 rounded-xl p-4">
								<label className="text-blue-300 text-sm font-semibold">Last Name</label>
								<p className="text-white text-lg mt-2">{user?.lastName}</p>
							</div>

							<div className="bg-white/5 border border-blue-400/20 rounded-xl p-4">
								<label className="text-blue-300 text-sm font-semibold">Email</label>
								<p className="text-white text-lg mt-2">{user?.email}</p>
							</div>

							<button
								onClick={() => setIsEditing(true)}
								className="w-full mt-6 py-2.5 px-4 rounded-lg font-bold text-white bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 transition-all transform hover:scale-105 shadow-lg"
							>
								✏️ Edit Profile
							</button>
						</div>
					) : (
						<div className="w-full space-y-4">
							<div>
								<label className="text-blue-300 text-sm font-semibold block mb-2">
									First Name
								</label>
								<input
									type="text"
									value={firstName}
									onChange={(e) => setFirstName(e.target.value)}
									className="w-full px-4 py-3 rounded-lg bg-white/10 border border-blue-400/50 text-white placeholder-blue-300/50 focus:outline-none focus:border-blue-300 focus:bg-white/20 transition-all"
									placeholder="Enter first name"
								/>
							</div>

							<div>
								<label className="text-blue-300 text-sm font-semibold block mb-2">
									Last Name
								</label>
								<input
									type="text"
									value={lastName}
									onChange={(e) => setLastName(e.target.value)}
									className="w-full px-4 py-3 rounded-lg bg-white/10 border border-blue-400/50 text-white placeholder-blue-300/50 focus:outline-none focus:border-blue-300 focus:bg-white/20 transition-all"
									placeholder="Enter last name"
								/>
							</div>

							<div className="flex gap-3 pt-4">
								<button
									onClick={handleUpdate}
									disabled={isSaving}
									className="flex-1 py-2.5 px-4 rounded-lg font-bold text-white bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 transition-all transform hover:scale-105 disabled:opacity-50"
								>
									{isSaving ? "Saving..." : "✅ Save"}
								</button>
								<button
									onClick={handleCancel}
									className="flex-1 py-2.5 px-4 rounded-lg font-bold text-white bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 transition-all transform hover:scale-105"
								>
									❌ Cancel
								</button>
							</div>
						</div>
					)}

					{/* Logout Button */}
					<button
						onClick={() => {
							localStorage.removeItem("token");
							window.location.reload();
						}}
						className="w-full mt-4 py-2.5 px-4 rounded-lg font-bold text-white bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 transition-all transform hover:scale-105 shadow-lg"
					>
						🚪 Logout
					</button>
				</div>

				<div
					title="Close"
					onClick={() => dispatch(setProfileDetail())}
					className="bg-blue-500/30 hover:bg-blue-500/50 h-8 w-8 rounded-lg flex items-center justify-center absolute top-4 right-4 cursor-pointer transition-all"
				>
					<MdOutlineClose size={22} className="text-blue-200" />
				</div>
			</div>
		</div>
	);
};

export default ProfileDetail;
