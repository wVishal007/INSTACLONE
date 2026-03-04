import {
  Heart,
  Home,
  LogOut,
  MessageCircle,
  PlusSquare,
  Search,
  TrendingUp,
  Settings,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import React, { useState } from "react";
import { toast } from "sonner";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { 
  setAuthUser, setFollowing, setmyStories, setSelectedUser, 
  setStories, setSuggestedUsers, setuserProfile 
} from "../redux/authSlice";
import { setPosts, setSavedPosts, setSelectedPost } from "../redux/postSlice";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import { setCommentNotification, setlikeNotifications } from "../redux/RTN";
import { FaHeart } from "react-icons/fa";
import { setMessages, setOnlineUsers } from "../redux/chatSlice";
import CreatePostVsStory from "./CreatePostVsStory";
import Logo from "./Logo";

const Leftsidebar = () => {
  const [open, setOpen] = useState(false);
  const { user } = useSelector((store) => store.auth);
  const { likeNotifications } = useSelector((store) => store.RealTimeNotifications);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation(); // To highlight active tab

  const LogOutHandler = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/user/logout`, {
        withCredentials: true,
      });
      if (res.data.success) {
        dispatch(setAuthUser(null));
        dispatch(setSelectedPost(null));
        dispatch(setPosts([]));
        dispatch(setFollowing([]));
        dispatch(setlikeNotifications([]));
        dispatch(setSuggestedUsers([]));
        dispatch(setSelectedUser(null));
        dispatch(setCommentNotification([]));
        dispatch(setStories([]));
        dispatch(setmyStories([]));
        dispatch(setOnlineUsers([]));
        dispatch(setMessages([]));
        dispatch(setuserProfile(null));
        dispatch(setSavedPosts([]));
        navigate("/login");
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Logout failed");
    }
  };

  const sideBarHandler = (textType) => {
    if (textType === "Logout") LogOutHandler();
    else if (textType === "Create") setOpen(true);
    else if (textType === "Profile") navigate(`/profile/${user?._id}`);
    else if (textType === "Home") navigate("/");
    else if (textType === "Messages") navigate("/chat");
    else if (textType === "Search") navigate("/Search");
    else if (textType === "Explore") navigate("/explore");
  };

  const SideBarItems = [
    { icon: <Home size={22} />, text: "Home", path: "/" },
    { icon: <Search size={22} />, text: "Search", path: "/Search" },
    // { icon: <TrendingUp size={22} />, text: "Explore", path: "/explore" },
    { icon: <MessageCircle size={22} />, text: "Messages", path: "/chat" },
    { icon: <Heart size={22} />, text: "Notifications", path: "/notifications" },
    { icon: <PlusSquare size={22} />, text: "Create", path: null },
    {
      icon: (
        <Avatar className="w-7 h-7 border-2 border-transparent group-hover:border-red-500 transition-all">
          <AvatarImage className="object-cover" src={user?.profilePicture} />
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
      ),
      text: "Profile",
      path: `/profile/${user?._id}`,
    },
  ];

  return (
    <div className="fixed hidden md:flex flex-col border-r border-white/10 bg-[#050505] top-0 z-50 left-0 w-[18%] lg:w-[16%] h-screen p-6 justify-between text-white">
      
      <div className="space-y-8">
        {/* Logo Section */}
        <div className="px-2">
          <h1 className="font-black text-2xl tracking-tighter flex items-center gap-2 italic hover:scale-105 transition-transform cursor-pointer" onClick={() => navigate('/')}>
            <FaHeart className="text-white drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]" /><Logo/>
          </h1>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-2">
          {SideBarItems.map((item, index) => {
            const isActive = location.pathname === item.path;
            return (
              <div
                key={index}
                onClick={() => sideBarHandler(item.text)}
                className={`group flex items-center gap-4 px-4 py-3.5 rounded-2xl cursor-pointer transition-all duration-300 ${
                  isActive 
                  ? "bg-white/10 text-white shadow-[inset_0_0_10px_rgba(255,255,255,0.05)]" 
                  : "text-gray-400 hover:bg-white/[0.05] hover:text-white"
                }`}
              >
                <div className={`${isActive ? "text-red-500" : "group-hover:scale-110"} transition-transform duration-200`}>
                  {item.icon}
                </div>
                <span className={`text-sm font-semibold tracking-wide ${isActive ? "opacity-100" : "opacity-80"}`}>
                  {item.text}
                </span>

                {/* Notification Badge Logic */}
                {item.text === "Notifications" && likeNotifications.length > 0 && (
                  <div className="ml-auto">
                    <Popover>
                      <PopoverTrigger asChild>
                        <div className="bg-red-500 text-[10px] font-bold h-5 w-5 rounded-full flex items-center justify-center animate-pulse shadow-lg shadow-red-500/40">
                          {likeNotifications.length}
                        </div>
                      </PopoverTrigger>
                      <PopoverContent className="bg-black/90 backdrop-blur-xl border-white/10 text-white rounded-2xl w-80 shadow-2xl ml-4">
                        <div className="space-y-4">
                          <p className="font-bold text-xs uppercase tracking-widest text-gray-500">Activity</p>
                          {likeNotifications.map((item, idx) => (
                            <div key={idx} className="flex items-center gap-3 p-2 hover:bg-white/5 rounded-xl transition-colors">
                              <Avatar className="h-8 w-8">
                                <AvatarImage className="object-cover" src={item?.userDetails.ProfilePicture} />
                                <AvatarFallback>U</AvatarFallback>
                              </Avatar>
                              <p className="text-xs">
                                <span className="font-bold">{item.userDetails?.username}</span> liked your post
                              </p>
                            </div>
                          ))}
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </div>

      {/* Bottom Section (Logout) */}
      <div className="border-t border-white/5 pt-6">
        <button 
          onClick={() => sideBarHandler("Logout")}
          className="w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-gray-500 hover:bg-red-500/10 hover:text-red-500 transition-all duration-300"
        >
          <LogOut size={22} />
          <span className="text-sm font-semibold tracking-wide">Logout</span>
        </button>
      </div>

      <CreatePostVsStory open={open} setOpen={setOpen} />
    </div>
  );
};

export default Leftsidebar;