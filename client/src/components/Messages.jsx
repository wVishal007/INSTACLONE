import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { useSelector } from "react-redux";
import { Dialog, DialogContent } from "./ui/dialog";
import usegetAllMessages from "../hooks/usegetAllMessages";
import usegetRealtimeMsgs from "../hooks/usegetRealtimeMsgs";
import { IoIosClose } from "react-icons/io";
import { ExternalLink } from "lucide-react";
import Post from './Post'

const Messages = ({ SelectedUser }) => {
  const { chatMessages } = useSelector((store) => store.chat);
  const { user } = useSelector((store) => store.auth);
  const { posts } = useSelector((store) => store.post);
  const [Show, setShow] = useState(false);
  const [CurrentPost, setCurrentPost] = useState({})
  
  usegetAllMessages();
  usegetRealtimeMsgs();

  return (
    <div className="overflow-y-auto flex-1 p-4 scrollbar-hide bg-[#050505]">
      {/* Header / Profile Preview */}
      <div className="flex flex-col items-center justify-center py-10 border-b border-white/5 mb-6">
        <div className="relative mb-4">
          <div className="absolute -inset-1 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-full blur opacity-30"></div>
          <Avatar className="h-24 w-24 relative border-4 border-[#050505]">
            <AvatarImage src={SelectedUser?.ProfilePicture} className="object-cover" />
            <AvatarFallback className="bg-white/10 text-white text-xl font-black">
              {SelectedUser?.username?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>
        <h2 className="text-xl font-black text-white">{SelectedUser?.username}</h2>
        <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mt-1">FunApp Creator</p>
        <Link to={`/profile/${SelectedUser?._id}`}>
          <Button variant="secondary" className="mt-4 bg-white/5 hover:bg-white/10 text-white font-bold rounded-xl px-6 text-xs uppercase tracking-widest border border-white/10">
            View Profile
          </Button>
        </Link>
      </div>

      {/* Message Thread */}
      <div className="flex flex-col space-y-4">
        {chatMessages?.map((msg) => {
          const isMine = msg.senderID === user?._id;
          const sharedPost = msg.PostMessage ? posts.find((p) => p._id === msg.PostMessage) : null;

          return (
            <div key={msg?._id} className={`flex w-full ${isMine ? "justify-end" : "justify-start"}`}>
              <div className={`flex gap-3 max-w-[75%] md:max-w-[60%] ${isMine ? "flex-row-reverse" : "flex-row"}`}>
                
                <Avatar className="h-8 w-8 shrink-0 self-end mb-1">
                  <AvatarImage className="object-cover" src={isMine ? user?.profilePicture : SelectedUser?.ProfilePicture} />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>

                <div className={`flex flex-col ${isMine ? "items-end" : "items-start"}`}>
                  {msg.PostMessage ? (
                    /* Shared Post Card */
                    <div 
                      onClick={() => { setCurrentPost(sharedPost); setShow(true); }}
                      className="cursor-pointer group relative overflow-hidden rounded-2xl border border-white/10 bg-[#111] hover:border-blue-500/50 transition-all duration-300 shadow-2xl"
                    >
                      <div className="p-2 flex items-center gap-2 border-b border-white/5">
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">Shared Post • {sharedPost?.author?.username}</span>
                        <ExternalLink size={10} className="text-gray-600" />
                      </div>
                      <img className="aspect-square w-full object-cover group-hover:scale-105 transition-transform duration-500" src={sharedPost?.image} alt="shared post" />
                      <div className="p-3 bg-white/5">
                        <p className="text-[11px] font-medium text-gray-300 line-clamp-2">{sharedPost?.caption}</p>
                      </div>
                    </div>
                  ) : (
                    /* Standard Text Message */
                    <div className={`px-4 py-2 rounded-2xl text-sm font-medium leading-relaxed ${
                      isMine 
                        ? "bg-blue-600 text-white rounded-br-none shadow-lg shadow-blue-900/20" 
                        : "bg-white/10 text-white rounded-bl-none border border-white/5"
                    }`}>
                      {msg.message}
                    </div>
                  )}
                  <span className="text-[9px] text-gray-600 mt-1 font-bold uppercase">{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Post Modal Overlay */}
      <Dialog open={Show} onOpenChange={setShow}>
        <DialogContent className="bg-[#050505] border-white/10 p-0 overflow-hidden max-w-4xl w-[95vw] sm:w-fit rounded-3xl">
          <div className="relative">
            <button 
              onClick={() => setShow(false)} 
              className="absolute top-4 right-4 z-50 p-2 bg-black/50 hover:bg-black rounded-full text-white transition-all"
            >
              <IoIosClose size={28} />
            </button>
            <div className="max-h-[85vh] overflow-y-auto">
              <Post Show={Show} post={CurrentPost} />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Messages;