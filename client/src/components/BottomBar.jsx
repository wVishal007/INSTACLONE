import { Heart, Home, MessageCircleMore, PlusSquare } from "lucide-react";
import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import CreatePostDialog from "./CreatePostDialog";

const BottomBar = () => {
  const { user } = useSelector((store) => store.auth);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate()
  return (
    <div className="block md:hidden">
      <div className="flex px-10 mt-2 items-center justify-between border-t border-t-gray-300 p-2">
        <div onClick={()=>navigate('/')} className="font-bold text-xl cursor-pointer"><Home/></div>
        <div onClick={()=>setOpen(true)} className="cursor-pointer"><PlusSquare/>
        <CreatePostDialog open={open} setOpen={setOpen} />
        </div>
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
