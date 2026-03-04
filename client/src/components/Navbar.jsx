import { Heart, MessageCircleMore } from "lucide-react";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import Logo from "./Logo";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { likeNotifications } = useSelector(store => store.RealTimeNotifications);
  const { user } = useSelector(store => store.auth);

  // Hide Navbar logic
  const isChatPage = location.pathname.startsWith("/chat");

  // Local state to hide red dot after click
  const [isLikesViewed, setIsLikesViewed] = useState(false);

  const handleLikeClick = () => {
    setIsLikesViewed(true);
    navigate("/notifications");
  };

  if (isChatPage) return null;

  return (
    <div className="block md:hidden sticky top-0 z-50">
      {/* The Glass Container */}
      <div className="flex px-5 py-4 items-center justify-between bg-[#050505]/80 backdrop-blur-xl border-b border-white/5">
        
        {/* Brand/Logo */}
        <div 
          onClick={() => navigate("/")}
          className="font-black text-2xl tracking-tighter cursor-pointer"
        >
          <span className="text-red-600"><Logo/></span>
        </div>

        {/* Action Icons */}
        <div className="flex gap-6 items-center font-bold">
          
          {/* Notifications/Likes */}
          <button 
            className="relative p-1 hover:bg-white/5 rounded-full transition-colors" 
            onClick={handleLikeClick}
          >
            <Heart size={24} className={likeNotifications.length > 0 && !isLikesViewed ? "text-red-500 fill-red-500" : "text-white"} />
            
            {!isLikesViewed && likeNotifications.length > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-red-600 text-white text-[10px] font-black rounded-full h-4 min-w-[16px] px-1 flex items-center justify-center border-2 border-[#050505]">
                {likeNotifications.length}
              </span>
            )}
          </button>

          {/* Messages */}
          <button 
            onClick={() => navigate("/chat")} 
            className="p-1 hover:bg-white/5 rounded-full transition-colors text-white"
          >
            <MessageCircleMore size={24} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;