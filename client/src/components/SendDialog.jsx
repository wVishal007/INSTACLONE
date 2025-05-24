import React, { useState } from "react";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "./ui/dialog";
import { useSelector } from "react-redux";
import { Send, SendHorizonal } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import axios from "axios";
import { toast } from "sonner";
import { setSelectedPost } from "../redux/postSlice";

const SendDialog = ({ OpenDialog, setOpen }) => {
  const { SuggestedUsers } = useSelector((store) => store.auth);
  const {SelectedPost} = useSelector(store=>store.post)
  const [postMessage, setpostMessage] = useState({})
  const SharePostHandler = async (USER) =>{
    try {
      console.log(postMessage);
          const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/v1/message/sendPost/${USER?._id}`,
        { PostMessage: SelectedPost?._id,message:'Check out this post' },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      if(res.data.success){
        toast.success(res.data.message)
        toast.success("post shared")
        setOpen(false)
      }
    } catch (error) {
      toast.error(error.response.data.message)
    }
  }
  return (
    <div>
      <Dialog open={OpenDialog}>
        <DialogTitle></DialogTitle>
        <DialogTrigger asChild></DialogTrigger>
        <DialogContent
          onInteractOutside={() => setOpen(false)}
          className="bg-white"
        >
          <div className="flex flex-col gap-2 ">
            {SuggestedUsers.map((USER) => {
              return (
                <div className="flex bg-gray-50 p-1 px-2 rounded-lg items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage
                        className="object-cover"
                        src={USER?.ProfilePicture}
                      />
                      <AvatarFallback>
                        <button className="bg-gray-200 px-3 py-1 rounded-full">
                          {USER?.username.charAt(0)}
                        </button>
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-semibold">{USER?.username}</span>
                  </div>
                  <button onClick={()=>{
                    SharePostHandler(USER)
                    setpostMessage(SelectedPost)
                    }} className="flex cursor-pointer gap-1">
                    <span>send</span>
                    <SendHorizonal />
                  </button>
                </div>
              );
            })}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SendDialog;
