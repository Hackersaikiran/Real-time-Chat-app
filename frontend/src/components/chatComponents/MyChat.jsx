import React, { useEffect } from "react";
import { FaPenAlt } from "react-icons/fa";
import { addMyChat, addSelectedChat } from "../../redux/slices/myChatSlice";
import { useDispatch, useSelector } from "react-redux";
import {
    setChatLoading,
    setGroupChatBox,
} from "../../redux/slices/conditionSlice";
import ChatShimmer from "../loading/ChatShimmer";
import getChatName, { getChatImage } from "../../utils/getChatName";
import { VscCheckAll } from "react-icons/vsc";
import { SimpleDateAndTime, SimpleTime } from "../../utils/formateDateTime";

const MyChat = () => {
    const dispatch = useDispatch();
    const myChat = useSelector((store) => store.myChat.chat);
    const authUserId = useSelector((store) => store?.auth?._id);
    const selectedChat = useSelector((store) => store?.myChat?.selectedChat);
    const isChatLoading = useSelector(
        (store) => store?.condition?.isChatLoading
    );
    // Re render newmessage send and new group chat created
    const newMessageId = useSelector((store) => store?.message?.newMessageId);
    const isGroupChatId = useSelector((store) => store.condition.isGroupChatId);
    // All My Chat Api Call
    useEffect(() => {
        const getMyChat = () => {
            dispatch(setChatLoading(true));
            const token = localStorage.getItem("token");
            fetch(`${import.meta.env.VITE_BACKEND_URL}/api/chat`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            })
                .then((res) => res.json())
                .then((json) => {
                    dispatch(addMyChat(json?.data || []));
                    dispatch(setChatLoading(false));
                })
                .catch((err) => {
                    console.log(err);
                    dispatch(setChatLoading(false));
                });
        };
        getMyChat();
    }, [newMessageId, isGroupChatId]);
    return (
        <>
            <div className="p-6 w-full h-[7vh] font-semibold flex justify-between items-center bg-gradient-to-r from-blue-900/50 to-slate-900 text-white border-blue-400/30 border-r border-b">
                <h1 className="mr-2 whitespace-nowrap bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">💬 My Chats</h1>
                <div
                    className="flex items-center gap-2 border border-blue-400/50 py-2 px-3 rounded-lg cursor-pointer hover:bg-blue-500/30 active:bg-blue-600/20 transition-all transform hover:scale-105 bg-blue-500/10"
                    title="Create New Group"
                    onClick={() => dispatch(setGroupChatBox())}
                >
                    <h1 className="line-clamp-1 lin whitespace-nowrap w-full text-blue-200">
                        New Group
                    </h1>
                    <FaPenAlt className="text-blue-300" />
                </div>
            </div>
            <div className="flex flex-col w-full px-4 gap-2 py-3 overflow-y-auto overflow-hidden scroll-style h-[73vh] bg-slate-900/30">
                {myChat.length == 0 && isChatLoading ? (
                    <ChatShimmer />
                ) : (
                    <>
                        {myChat?.length === 0 && (
                            <div className="w-full h-full flex justify-center items-center text-blue-300">
                                <h1 className="text-base font-semibold">
                                    ✨ Start a new conversation
                                </h1>
                            </div>
                        )}
                        {myChat?.map((chat) => {
                            return (
                                <div
                                    key={chat?._id}
                                    className={`w-full h-16 border rounded-xl flex justify-start items-center p-3 font-semibold gap-3 transition-all cursor-pointer transform hover:scale-102 ${
                                        selectedChat?._id == chat?._id
                                            ? "bg-gradient-to-r from-blue-500/40 to-cyan-500/40 border-blue-400/50 shadow-lg shadow-blue-500/30"
                                            : "bg-white/5 border-blue-400/20 hover:bg-white/10 hover:border-blue-400/40"
                                    }`}
                                    onClick={() => {
                                        dispatch(addSelectedChat(chat));
                                    }}
                                >
                                    <img
                                        className="h-12 min-w-12 rounded-full border border-blue-400/50 shadow-md"
                                        src={getChatImage(chat, authUserId)}
                                        alt="chat-avatar"
                                    />
                                    <div className="w-full">
                                        <div className="flex justify-between items-center w-full">
                                            <span className="line-clamp-1 capitalize text-blue-100">
                                                {getChatName(chat, authUserId)}
                                            </span>
                                            <span className="text-xs font-light ml-1 text-blue-300">
                                                {chat?.latestMessage &&
                                                    SimpleTime(
                                                        chat?.latestMessage
                                                            ?.createdAt
                                                    )}
                                            </span>
                                        </div>
                                        <span className="text-xs font-light line-clamp-1 text-blue-200/70">
                                            {chat?.latestMessage ? (
                                                <div className="flex items-end gap-1">
                                                    <span>
                                                        {chat?.latestMessage
                                                            ?.sender?._id ===
                                                            authUserId && (
                                                            <VscCheckAll
                                                                color="#93c5fd"
                                                                fontSize={14}
                                                            />
                                                        )}
                                                    </span>
                                                    <span className="line-clamp-1">
                                                        {
                                                            chat?.latestMessage
                                                                ?.message
                                                        }
                                                    </span>
                                                </div>
                                            ) : (
                                                <span className="text-xs font-light">
                                                    {SimpleDateAndTime(
                                                        chat?.createdAt
                                                    )}
                                                </span>
                                            )}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </>
                )}
            </div>
        </>
    );
};

export default MyChat;
