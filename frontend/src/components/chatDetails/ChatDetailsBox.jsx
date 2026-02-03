import React, { useState } from "react";
import { CiCircleInfo } from "react-icons/ci";
import { HiOutlineUsers } from "react-icons/hi2";
import Overview from "./Overview";
import Member from "./Member";
import { IoSettingsOutline } from "react-icons/io5";
import ChatSetting from "./ChatSetting";
import { useSelector } from "react-redux";

const ChatDetailsBox = () => {
	const selectedChat = useSelector((store) => store?.myChat?.selectedChat);
	const [detailView, setDetailView] = useState("overview");
	return (
		<>
			<div className="w-fit h-[60vh] p-3 flex flex-col gap-2 bg-gradient-to-b from-blue-900/30 to-slate-900/30 border border-blue-400/30 rounded-xl">
				<div
					className={`flex gap-2 items-center p-2 text-white rounded-lg px-3 cursor-pointer transition-all transform hover:scale-105 ${
						detailView === "overview"
							? "bg-gradient-to-r from-blue-500/50 to-cyan-500/50 border border-blue-400/50 shadow-lg shadow-blue-500/30"
							: "bg-white/10 border border-blue-400/20 hover:bg-white/20"
					}`}
					onClick={() => setDetailView("overview")}
					title="Overview"
				>
					<CiCircleInfo fontSize={18} />
					<span className="hidden sm:block">Overview</span>
				</div>
				{selectedChat?.isGroupChat && (
					<div
						className={`flex gap-2 items-center p-2 text-white rounded-lg px-3 cursor-pointer transition-all transform hover:scale-105 ${
							detailView === "members"
								? "bg-gradient-to-r from-blue-500/50 to-cyan-500/50 border border-blue-400/50 shadow-lg shadow-blue-500/30"
								: "bg-white/10 border border-blue-400/20 hover:bg-white/20"
						}`}
						onClick={() => setDetailView("members")}
						title="Member"
					>
						<HiOutlineUsers fontSize={18} />
						<span className="hidden sm:block">Members</span>
					</div>
				)}
				<div
					className={`flex gap-2 items-center p-2 text-white rounded-lg px-3 cursor-pointer transition-all transform hover:scale-105 ${
						detailView === "setting"
							? "bg-gradient-to-r from-blue-500/50 to-cyan-500/50 border border-blue-400/50 shadow-lg shadow-blue-500/30"
							: "bg-white/10 border border-blue-400/20 hover:bg-white/20"
					}`}
					onClick={() => setDetailView("setting")}
					title="Setting"
				>
					<IoSettingsOutline fontSize={18} />
					<span className="hidden sm:block">Setting</span>
				</div>
			</div>
			<div className="w-full h-[60vh] bg-gradient-to-b from-slate-900/50 to-slate-950 border border-blue-400/20 rounded-xl p-4 overflow-y-auto">
				{detailView === "overview" && <Overview />}
				{detailView === "members" && <Member />}
				{detailView === "setting" && <ChatSetting />}
			</div>
		</>
	);
};

export default ChatDetailsBox;
