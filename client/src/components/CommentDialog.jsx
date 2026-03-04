import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Link } from "react-router-dom";
import { MoreHorizontal, Send, MessageSquareText } from "lucide-react";
import { Button } from "./ui/button";
import { useDispatch, useSelector } from "react-redux";
import CommentBar from "./CommentBar";
import { toast } from "sonner";
import { setPosts } from "../redux/postSlice";
import axios from "axios";

const CommentDialog = ({ openComments, setopenComments }) => {
  const [text, setText] = useState("");
  const { SelectedPost, posts } = useSelector((store) => store.post);
  const dispatch = useDispatch();
  const [comments, setComments] = useState([]);

  // Sync internal state with SelectedPost
  useEffect(() => {
    if (SelectedPost) {
      setComments(SelectedPost.comments || []);
    }
  }, [SelectedPost]);

  const sendMessageHandler = async () => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/v1/post/${SelectedPost?._id}/comment`,
        { text },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        const newComment = res.data.Comment;
        const updatedCommentData = [...comments, newComment];
        setComments(updatedCommentData);

        const updatedPostData = posts.map((p) =>
          p._id === SelectedPost._id ? { ...p, comments: updatedCommentData } : p
        );
        dispatch(setPosts(updatedPostData));
        setText("");
        toast.success("Comment added!");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <Dialog open={openComments} onOpenChange={setopenComments}>
      <DialogContent
        onInteractOutside={() => setopenComments(false)}
        className="flex flex-col md:flex-row md:max-w-5xl p-0 bg-[#0a0a0a]/95 backdrop-blur-2xl border-white/10 text-white overflow-hidden rounded-3xl h-[90vh] md:h-[70vh]"
      >
        {/* LEFT: Image Preview (Desktop Only) */}
        <div className="hidden md:flex md:w-1/2 bg-black items-center justify-center border-r border-white/5">
          <img
            className="w-full h-full object-contain"
            src={SelectedPost?.image}
            alt="Post"
          />
        </div>

        {/* RIGHT: Comments Section */}
        <div className="flex flex-col flex-1 h-full">
          {/* Header */}
          <div className="flex justify-between items-center p-4 border-b border-white/5 bg-white/5">
            <div className="flex gap-3 items-center">
              <Avatar className="h-8 w-8 border border-white/10">
                <AvatarImage src={SelectedPost?.author?.ProfilePicture} />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <Link to={`/profile/${SelectedPost?.author?._id}`} className="text-sm font-black hover:text-red-500 transition-colors">
                  {SelectedPost?.author?.username}
                </Link>
                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Original Poster</span>
              </div>
            </div>
            
            <Dialog>
              <DialogTrigger asChild>
                <button className="p-2 hover:bg-white/10 rounded-full transition-colors">
                  <MoreHorizontal size={20} className="text-gray-400" />
                </button>
              </DialogTrigger>
              <DialogContent className="bg-[#0a0a0a] border-white/10 text-white w-64 rounded-2xl">
                <div className="flex flex-col gap-1 p-2">
                   <Button variant="ghost" className="text-red-500 font-black uppercase text-xs hover:bg-red-500/10">Unfollow</Button>
                   <Button variant="ghost" className="text-xs font-bold hover:bg-white/5">Report</Button>
                   <Button variant="ghost" className="text-xs font-bold hover:bg-white/5">Share</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Comments List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2 scrollbar-hide">
            {comments.length > 0 ? (
              comments.map((c) => (
                <CommentBar key={c._id} Comment={c} />
              ))
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-gray-600">
                <MessageSquareText size={48} className="mb-2 opacity-20" />
                <p className="text-xs font-black uppercase tracking-widest">Be the first to speak</p>
              </div>
            )}
          </div>

          {/* Input Footer */}
          <div className="p-4 border-t border-white/5 bg-white/5">
            <div className="flex items-center gap-3 bg-white/5 border border-white/10 p-2 pl-4 rounded-2xl focus-within:border-red-500/50 transition-all">
              <input
                type="text"
                onChange={(e) => setText(e.target.value)}
                value={text}
                placeholder="Add a comment..."
                className="flex-1 bg-transparent outline-none text-sm text-white placeholder:text-gray-600"
              />
              <Button 
                onClick={sendMessageHandler} 
                disabled={!text.trim()}
                className="bg-red-600 hover:bg-red-500 h-9 w-9 p-0 rounded-xl shadow-lg shadow-red-900/20 transition-all active:scale-90"
              >
                <Send size={16} />
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CommentDialog;