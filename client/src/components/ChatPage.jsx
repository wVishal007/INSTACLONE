import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { setSelectedUser } from "../redux/authSlice";
import { setMessages } from "../redux/chatSlice";
import Messages from "./Messages";
import { Button } from "./ui/button";
import { Image as ImageIcon, MessageCircleMore, Send, Search } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";

const ChatPage = () => {
  const inputRef = useRef();
  const [TextMessage, setTextMessage] = useState("");
  const { user, SuggestedUsers, SelectedUser } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const { onlineUsers, chatMessages } = useSelector((store) => store.chat);

  const SendMessageHandler = async (recieverID) => {
    if (!TextMessage.trim()) return;
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/v1/message/send/${recieverID}`,
        { message: TextMessage },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        dispatch(setMessages([...chatMessages, res.data.newMessage]));
        setTextMessage("");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error sending message");
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => dispatch(setSelectedUser(null));
  }, [dispatch]);

  return (
    // md:ml-[18%] ensures it doesn't overlap your fixed sidebar
    <div className="flex md:ml-[18%] lg:ml-[16%] h-screen bg-[#050505] text-white overflow-hidden">
      
      {/* LEFT PANEL: User List */}
      <section className="w-full md:w-[350px] lg:w-[400px] flex flex-col border-r border-white/5 bg-[#050505]">
        <div className="p-6">
          <h1 
            onClick={() => dispatch(setSelectedUser(null))}
            className="font-black text-2xl tracking-tighter cursor-pointer hover:text-red-500 transition-colors"
          >
            Messages
          </h1>
          <div className="relative mt-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 size-4" />
            <input 
              type="text" 
              placeholder="Search chat..." 
              className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-red-500/50 transition-all"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-2 space-y-1 scrollbar-hide">
          {SuggestedUsers.map((item) => {
            const isOnline = onlineUsers.includes(item?._id);
            const isSelected = SelectedUser?._id === item?._id;
            return (
              <div
                key={item?._id}
                onClick={() => dispatch(setSelectedUser(item))}
                className={`flex gap-3 p-3 rounded-2xl items-center cursor-pointer transition-all duration-300 ${
                  isSelected ? "bg-white/10 shadow-xl" : "hover:bg-white/5"
                }`}
              >
                <div className="relative">
                  <Avatar className="w-12 h-12 border border-white/10">
                    <AvatarImage className="object-cover" src={item?.ProfilePicture} />
                    <AvatarFallback>{item?.username?.charAt(0)}</AvatarFallback>
                  </Avatar>
                  {isOnline && (
                    <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-[#050505] rounded-full" />
                  )}
                </div>
                
                <div className="flex flex-col flex-1 overflow-hidden">
                  <span className="font-bold text-sm truncate">{item?.username}</span>
                  <span className={`text-[10px] font-black uppercase tracking-widest ${isOnline ? "text-green-500" : "text-gray-600"}`}>
                    {isOnline ? "Active Now" : "Offline"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* RIGHT PANEL: Chat Area */}
      {SelectedUser ? (
        <section className="flex-1 flex flex-col h-full bg-[#080808]">
          {/* Header */}
          <div className="p-4 border-b border-white/5 backdrop-blur-md bg-[#050505]/50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10 border border-white/10">
                <AvatarImage className="object-cover" src={SelectedUser?.ProfilePicture} />
                <AvatarFallback>{SelectedUser?.username?.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="font-bold text-sm">{SelectedUser?.username}</span>
                <span className="text-[10px] text-green-500 font-bold uppercase">Online</span>
              </div>
            </div>
          </div>

          {/* Messages Container */}
          <Messages SelectedUser={SelectedUser} />

          {/* Input Area */}
          <div className="p-4 bg-[#050505] border-t border-white/5">
            <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl px-4 py-2 focus-within:border-red-500/30 transition-all">
              <button 
                onClick={() => inputRef.current.click()}
                className="text-gray-500 hover:text-white transition-colors"
              >
                <ImageIcon size={20} />
              </button>
              <input ref={inputRef} className="hidden" type="file" />
              
              <input
                value={TextMessage}
                onChange={(e) => setTextMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && SendMessageHandler(SelectedUser?._id)}
                type="text"
                className="flex-1 bg-transparent border-none py-2 text-sm text-white placeholder:text-gray-600 focus:outline-none"
                placeholder="Write a message..."
              />

              <Button
                onClick={() => SendMessageHandler(SelectedUser?._id)}
                className={`p-2 h-10 w-10 rounded-xl transition-all ${
                    TextMessage.trim() ? "bg-red-600 hover:bg-red-500 text-white" : "bg-white/5 text-gray-700"
                }`}
              >
                <Send size={18} />
              </Button>
            </div>
          </div>
        </section>
      ) : (
        /* Empty State */
        <section className="flex-1 hidden md:flex flex-col items-center justify-center bg-[#080808] p-10">
          <div className="relative">
            <div className="absolute inset-0 bg-red-600/20 blur-[100px] rounded-full" />
            <MessageCircleMore className="w-24 h-24 text-white/10 relative z-10" />
          </div>
          <h2 className="text-2xl font-black mt-6 tracking-tighter">Your Messages</h2>
          <p className="text-gray-500 text-sm mt-2 font-medium">Select a creator to start a conversation</p>
          <Button 
            onClick={() => dispatch(setSelectedUser(SuggestedUsers[0]))}
            className="mt-6 bg-white text-black font-black uppercase text-xs tracking-widest px-8 rounded-full hover:bg-gray-200"
          >
            Start Chatting
          </Button>
        </section>
      )}
    </div>
  );
};

export default ChatPage;