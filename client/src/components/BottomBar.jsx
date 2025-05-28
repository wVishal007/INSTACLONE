import { Heart, Home, MessageCircleMore, PlusSquare, Search } from "lucide-react";
import React, { useState,useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import CreatePostDialog from "./CreatePostDialog";
import CreatePostVsStory from "./CreatePostVsStory";

const BottomBar = () => {
  const { user } = useSelector((store) => store.auth);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate()
    const location = useLocation();
     const {SelectedUser} = useSelector(store=>store.auth)
    const HideBottom = location.pathname === "/chat"
useEffect(()=>{
 const HideBottom = location.pathname === `/chat/${SelectedUser?._id}`
},[navigate])
  return (
    <div className={`${HideBottom && SelectedUser ? 'hidden':'block'} md:hidden"`}>
    {/* <div className={`block md:hidden"`}> */}
      <div className="flex px-10 mt-2 items-center justify-between border-t border-t-gray-300 p-2">
        <div onClick={()=>navigate('/')} className="font-bold text-xl cursor-pointer"><Home/></div>
        <div onClick={()=>setOpen(true)} className="cursor-pointer"><PlusSquare/>
        <span className="hidden">
       <CreatePostVsStory open={open} setOpen={setOpen} />
     </span>
        </div>
        <div onClick={()=>navigate('/Search')} className="cursor-pointer"><Search/></div>
        <div onClick={()=>navigate(`/profile/${user?._id}`)} className="flex gap-2 font-bold cursor-pointer">
          <Avatar className="w-10 h-10">
            <AvatarImage className="object-cover" src={user?.profilePicture} />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </div>
  );
};

export default BottomBar;
