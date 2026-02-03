import React, { useEffect, useRef, useState } from "react";
import { FaFolderOpen, FaPaperPlane } from "react-icons/fa";
import { MdOutlineClose } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { setSendLoading, setTyping } from "../../redux/slices/conditionSlice";
import {
	addNewMessage,
	addNewMessageId,
} from "../../redux/slices/messageSlice";
import { LuLoader } from "react-icons/lu";
import { toast } from "react-toastify";
import socket from "../../socket/socket";

let lastTypingTime;
const MessageSend = ({ chatId }) => {
	const mediaFile = useRef();
	// const [mediaBox, setMediaBox] = useState(false);
	// const [mediaURL, setMediaURL] = useState("");
	const [newMessage, setMessage] = useState("");
	const dispatch = useDispatch();
	const isSendLoading = useSelector(
		(store) => store?.condition?.isSendLoading
	);
	const isSocketConnected = useSelector(
		(store) => store?.condition?.isSocketConnected
	);
	const selectedChat = useSelector((store) => store?.myChat?.selectedChat);
	const isTyping = useSelector((store) => store?.condition?.isTyping);

	useEffect(() => {
		socket.on("typing", () => dispatch(setTyping(true)));
		socket.on("stop typing", () => dispatch(setTyping(false)));
	}, []);

	// Media Box Control
	const handleMediaBox = () => {
		if (mediaFile.current?.files[0]) {
			// const file = mediaFile.current.files[0];
			// const url = URL.createObjectURL(file);
			// setMediaURL(url);
			// setMediaBox(true);
			toast.warn("Comming soon...");
		} else {
			// setMediaBox(false);
		}
	};

	// Media Box Hidden && Input file remove
	// const clearMediaFile = () => {
	//     mediaFile.current.value = "";
	//     setMediaURL("");
	//     setMediaBox(false);
	// };

	// Send Message Api call
	const handleSendMessage = async () => {
		if (newMessage?.trim()) {
			const message = newMessage?.trim();
			setMessage("");
			socket.emit("stop typing", selectedChat._id);
			dispatch(setSendLoading(true));
			const token = localStorage.getItem("token");
			fetch(`${import.meta.env.VITE_BACKEND_URL}/api/message`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify({
					message: message,
					chatId: chatId,
				}),
			})
				.then((res) => res.json())
				.then((json) => {
					dispatch(addNewMessageId(json?.data?._id));
					dispatch(addNewMessage(json?.data));
					socket.emit("new message", json.data);
					dispatch(setSendLoading(false));
				})
				.catch((err) => {
					console.log(err);
					dispatch(setSendLoading(false));
					toast.error("Message Sending Failed");
				});
		}
	};

	const handleTyping = (e) => {
		setMessage(e.target?.value);
		if (!isSocketConnected) return;
		if (!isTyping) {
			socket.emit("typing", selectedChat._id);
		}
		lastTypingTime = new Date().getTime();
		let timerLength = 3000;
		let stopTyping = setTimeout(() => {
			let timeNow = new Date().getTime();
			let timeDiff = timeNow - lastTypingTime;
			if (timeDiff > timerLength) {
				socket.emit("stop typing", selectedChat._id);
			}
		}, timerLength);
		return () => clearTimeout(stopTyping);
	};

	return (
		<>
			{/* {mediaBox && (
                <div className="border-slate-500 border rounded-md absolute bottom-[7vh] mb-1 left-2 bg-slate-800 w-60 h-48 ">
                    <img
                        src={mediaURL}
                        alt="media"
                        className="h-full w-full object-contain"
                    />
                    <MdOutlineClose
                        title="Delete"
                        size={25}
                        className="absolute top-2 right-3 cursor-pointer text-white bg-slate-800 rounded-xl p-1"
                        onClick={clearMediaFile}
                    />
                </div>
            )} */}
			<form
				className="w-full flex items-center gap-2 h-[7vh] p-3 bg-gradient-to-r from-blue-900/30 to-slate-900 text-white border-t border-blue-400/30"
				onSubmit={(e) => e.preventDefault()}
			>
				<label htmlFor="media" className="cursor-pointer text-blue-300 hover:text-blue-100 transition-all">
					<FaFolderOpen
						title="Open File"
						size={20}
						className="active:scale-75 hover:scale-110 transition-all"
					/>
				</label>
				<input
					ref={mediaFile}
					type="file"
					name="image"
					accept="image/png, image/jpg, image/gif, image/jpeg"
					id="media"
					className="hidden"
					onChange={handleMediaBox}
				/>
				<input
					type="text"
					className="outline-none p-3 w-full bg-white/10 border border-blue-400/50 rounded-lg text-white placeholder-blue-300/50 focus:border-blue-300 focus:bg-white/20 transition-all"
					placeholder="✨ Type a message..."
					value={newMessage}
					onChange={(e) => handleTyping(e)}
				/>
				<span className="flex justify-center items-center gap-2">
					{newMessage?.trim() && !isSendLoading && (
						<button
							className="outline-none p-2 text-blue-300 hover:text-blue-100 hover:bg-blue-500/30 rounded-lg transition-all transform hover:scale-110"
							onClick={handleSendMessage}
						>
							<FaPaperPlane
								title="Send"
								size={18}
								className="active:scale-75"
							/>
						</button>
					)}
					{isSendLoading && (
						<button className="outline-none p-2 text-blue-400">
							<LuLoader
								title="loading..."
								fontSize={18}
								className="animate-spin"
							/>
						</button>
					)}
				</span>
			</form>
		</>
	);
};

export default MessageSend;
