import { Heart, MessageCircleMore } from "lucide-react";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { likeNotifications } = useSelector(store => store.RealTimeNotifications);
  const { user } = useSelector(store => store.auth);

  const HideNavbar = location.pathname === "/chat";

  useEffect(() => {
    const HideNavbar = location.pathname === "/chat";
  }, [navigate]);

  return (
    <div className="block md:hidden">
      <div
        className={`flex px-3 mt-5 items-center justify-between ${
          HideNavbar ? "hidden" : "flex"
        }`}
      >
        <div className="font-bold text-xl">Diary</div>
        <div className="flex gap-4 items-center font-bold relative">
          
          {/* Likes */}
          <span className="relative cursor-pointer" onClick={() => navigate("/notifications")}>
            <Heart />
            {likeNotifications.length > 0 && (
              <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                {likeNotifications.length}
              </span>
            )}
          </span>

          {/* Messages */}
          <span onClick={() => navigate("/chat")} className="cursor-pointer">
            <MessageCircleMore />
          </span>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
