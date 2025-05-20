import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Link } from "react-router-dom";
import { Ghost, MoreHorizontal } from "lucide-react";
import { Button } from "./ui/button";
import { useDispatch, useSelector } from "react-redux";
import CommentBar from "./CommentBar";
import { toast } from "sonner";
import { setPosts } from "../redux/postSlice";
import axios from "axios";

const CommentDialog = ({ openComments, setopenComments }) => {
  const [Text, setText] = useState("");
  const {SelectedPost,posts} = useSelector(store=>store.post)
  const dispatch = useDispatch();
   const [Comment, setComment] = useState(SelectedPost?.comments || []);

    useEffect(() => {
    if(SelectedPost){
   setComment(SelectedPost?.comments)
    }
    }, [SelectedPost])
    

  const changeEventHandler = (e) => {
    const inputText = e.target.value;
    if (inputText.trim()) {
      setText(inputText);
    } else {
      setText("");
    }
  };

   const sendMessageHandler = async () => {
    try {
      const res = await axios.post(
        `http://localhost:3000/api/v1/post/${SelectedPost?._id}/comment`,
        { text:Text },
        {
          headers: {
            "Content-Type": "application/json",
          },
           withCredentials: true 
        }
        
      );
      if (res.data.success) {
        const updatedCommentData = [...Comment, res.data.Comment];
        setComment(updatedCommentData);

           const updatedPostData = posts.map((p) =>
          p._id === SelectedPost._id
            ? {
                ...p,
                comments: updatedCommentData}
              
            : p
        );
         dispatch(setPosts(updatedPostData));

        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error)
      toast.error(error.response.data.message);
    }
  };

  return (
    <Dialog open={openComments}>
      <DialogContent
        onInteractOutside={() => setopenComments(false)}
        className="flex flex-col w-screen md:w-[200%] p-0 bg-white"
      >
        <div className="flex flex-1">
          <div className="w-1/2">
            {" "}
            <img
              className="w-full h-full rounded-l-lg object-cover"
              src={SelectedPost?.image}
              alt=""
            />
          </div>
          <div className="flex w-1/2 flex-col justify-between">
            <div className="flex justify-between p-4">
              <div className="flex gap-3 items-center">
                <Link>
                  {" "}
                  <Avatar>
                    <AvatarImage className="w-6 h-6 rounded-full object-cover" src={SelectedPost?.author.ProfilePicture} />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                </Link>
                <div>
                  <Link className="text-xs font-semibold">{SelectedPost?.author.username}</Link>
                  {/* <span>Bio here</span> */}
                </div>
              </div>
              <Dialog>
                <DialogTrigger aschild>
                  <MoreHorizontal className="cursor-pointer border-none ring-transparent" />
                </DialogTrigger>
                <DialogContent className="bg-white">
                  <Button
                    variant={Ghost}
                    className="hover:bg-gray-400 cursor-pointer text-[#ED4956] font-bold"
                  >
                    unfollow
                  </Button>
                  <Button
                    variant={Ghost}
                    className="hover:bg-gray-400 cursor-pointer"
                  >
                    Report Account
                  </Button>
                  <Button
                    variant={Ghost}
                    className="hover:bg-gray-400 cursor-pointer"
                  >
                    Share Profile
                  </Button>
                </DialogContent>
              </Dialog>
            </div>
            <hr className="border-1/10 text-gray-200" />
            <div className="flex-1 max-h-96 p-4 overflow-y-auto">
              {
                Comment.map((comment)=>{
                  return <CommentBar key={comment._id} Comment={comment} />

                })
              }
            </div>
            <div className="p-4">
              <div className="flex justify-between gap-3">
                <input
                  type="text" onChange={changeEventHandler} value={Text}
                  placeholder="add a comment"
                  className="w-full outline-none border h-8 text-sm  border-gray-300 p-2 rounded"
                />
                <Button className='text-xs w-13 h-8 cursor-pointer' onClick={sendMessageHandler} disabled={!Text.trim()}>send</Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CommentDialog;
