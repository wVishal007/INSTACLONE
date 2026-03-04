import { Home, PlusSquare, Search, User } from "lucide-react";
import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import CreatePostVsStory from "./CreatePostVsStory";

const BottomBar = () => {
  const { user } = useSelector((store) => store.auth);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Optimized hide logic: Hide on any chat-related subroute
  const isChatting = location.pathname.startsWith("/chat");

  if (isChatting) return null;

  const navItems = [
    { icon: <Home size={26} />, path: "/", label: "Home" },
    { icon: <Search size={26} />, path: "/search", label: "Search" },
    { icon: <PlusSquare size={26} />, action: () => setOpen(true), label: "Create" },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 w-full z-50">
      {/* Glassmorphism Container */}
      <div className="flex items-center justify-around bg-[#050505]/80 backdrop-blur-2xl border-t border-white/5 px-4 py-3 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
        
        {navItems.map((item, index) => (
          <div
            key={index}
            onClick={item.action ? item.action : () => navigate(item.path)}
            className={`cursor-pointer transition-all duration-300 hover:scale-110 ${
              location.pathname === item.path ? "text-red-600" : "text-white"
            }`}
          >
            {item.icon}
          </div>
        ))}

        {/* Profile Avatar with Active Ring */}
        <div 
          onClick={() => navigate(`/profile/${user?._id}`)} 
          className="cursor-pointer transition-transform active:scale-90"
        >
          <Avatar className={`w-8 h-8 border-2 ${
            location.pathname.includes('/profile') ? "border-red-600" : "border-transparent"
          }`}>
            <AvatarImage className="object-cover" src={user?.profilePicture} />
            <AvatarFallback className="bg-white/10 text-[10px]">
              {user?.username?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>

      {/* Content Creation Dialog */}
      <CreatePostVsStory open={open} setOpen={setOpen} />
    </div>
  );
};

export default BottomBar;