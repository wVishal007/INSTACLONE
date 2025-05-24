import {
  Heart,
  Home,
  LogOut,
  MessageCircle,
  PlusSquare,
  Search,
  TrendingUp,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import React, { useState } from "react";
import { toast } from "sonner";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setAuthUser,setFollowing,setSelectedUser,setSuggestedUsers } from "../redux/authSlice";
import CreatePostDialog from "./CreatePostDialog";
import { setPosts, setSelectedPost } from "../redux/postSlice";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import { setlikeNotifications } from "../redux/RTN";
import { FaHeart } from "react-icons/fa";



const Leftsidebar = () => {
  const [open, setOpen] = useState(false);
  const { user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const [phone, setphone] = useState(false);
  const navigate = useNavigate();
  const { likeNotifications } = useSelector(
    (store) => store.RealTimeNotifications
  );

  const LogOutHandler = async () => {
    try {
      console.log('hello')
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/user/logout`, {
        withCredentials: true,
      });
      if (res.data.success) {
        dispatch(setAuthUser(null));
        dispatch(setSelectedPost(null));
        dispatch(setPosts([]));
        dispatch(setFollowing([]))
        dispatch(setlikeNotifications([]))
        dispatch(setSuggestedUsers([]))
        dispatch(setSelectedUser(null))
        navigate("/login");
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
      
      ;
    }
  };

  const sideBarHandler = (textType) => {
    if (textType == "Logout") {
      LogOutHandler();
    } else if (textType == "Create") {
      setOpen(true);
    } else if (textType == "Profile") {
      navigate(`/profile/${user?._id}`);
    } else if (textType == "Home") {
      navigate("/");
    } else if (textType == "Messages") {
      navigate("/chat");
    } else if(textType == "Search"){
      navigate("/Search")
    }
  };

  const SideBarItems = [
    { icon: <Home />, text: "Home" },
    { icon: <Search />, text: "Search" },
    { icon: <TrendingUp />, text: "Explore" },
    { icon: <MessageCircle />, text: "Messages" },
    { icon: <Heart />, text: "Notifications" },
    { icon: <PlusSquare />, text: "Create" },
    {
      icon: (
        <Avatar className="w-6 h-6">
          <AvatarImage className="object-cover" src={user?.profilePicture} />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      ),
      text: "Profile",
    },
    { icon: <LogOut />, text: "Logout" },
  ];

  return (
    <div className="fixed hidden md:block  border-r border-gray-500 top-0 z-10 left-0 px-4 w-[16%] h-screen">
      <div className="flex flex-col gap-3">
        <h1 className="font-bold font-mono text-4xl flex gap-1 my-1">FUN<FaHeart className="text-red-500"/> APP</h1>
        {SideBarItems.map((items, index) => {
          return (
            <div
              key={index}
              onClick={() => sideBarHandler(items.text)}
              className="flex items-center gap-3 relative hover:bg-gray-400 cursor-pointer rounded-lg p-3 my-1"
            >
              {items.icon}
              <span>{items.text}</span>
              {items.text === "Notifications" &&
                likeNotifications.length > 0 && (
                  <Popover >
                    <PopoverTrigger asChild>
                      <Button 
                        className="bg-red-500 rounded-full h-5 w-5 absolute bottom-6 left-6"
                        size="icon"
                      >
                        {likeNotifications.length}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="bg-white text-black rounded-xl mx-5 my-3">
                      <div>
                        {likeNotifications.length === 0 ? (
                          <p>no new notifications</p>
                        ) : (
                          likeNotifications.map((item) => {
                            return (
                              <div key={item.userID} className="flex items-center gap-3">
                                <Avatar>
                                  <AvatarImage
                                    className="object-cover"
                                    src={item?.userDetails.ProfilePicture}
                                  />
                                  <AvatarFallback>CN</AvatarFallback>
                                </Avatar>
                                <p className="text-sm">
                                  <span className="font-bold">
                                    {item.userDetails?.username}
                                  </span>{" "}
                                  liked your post
                                </p>
                              </div>
                            );
                          })
                        )}
                      </div>
                    </PopoverContent>
                  </Popover>
                )}
            </div>
          );
        })}
      </div>
      <CreatePostDialog open={open} setOpen={setOpen} />
    </div>
  );
};

export default Leftsidebar;
