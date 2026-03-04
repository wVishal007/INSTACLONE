import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { Badge } from "./ui/badge";
import {
  Bookmark,
  MessageCircle,
  MoreHorizontal,
  Send,
  Share2,
  Trash2,
  AlertCircle
} from "lucide-react";
import React, { useState } from "react";
import { Button } from "./ui/button";
import { FaBookmark, FaHeart, FaRegHeart } from "react-icons/fa";
import CommentDialog from "./CommentDialog";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import axios from "axios";
import { setPosts, setSelectedPost, setSavedPosts } from "../redux/postSlice";
import useGetSavedPosts from "../hooks/useGetSavedPosts";
import { setFollowing } from "../redux/authSlice";
import { useNavigate } from "react-router-dom";
import SendDialog from "./SendDialog";

const Post = ({ post, Show = false }) => {
  if (!post) return <div className="p-8 text-center text-gray-500 font-mono">Post vanished into the void...</div>;

  useGetSavedPosts();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { user, Following } = useSelector((store) => store.auth);
  const { posts, SavedPosts } = useSelector((store) => store.post);
  
  const [CommentText, setCommentText] = useState("");
  const [openComments, setopenComments] = useState(false);
  const [liked, setliked] = useState(post.likes?.includes(user?._id) || false);
  const [postLikes, setpostLikes] = useState(post.likes?.length || 0);
  const [OpenShareDialog, setOpenShareDialog] = useState(false);

  const changeEventHandler = (e) => setCommentText(e.target.value);

  const FollowUnfollowHandler = async (USER) => {
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/v1/user/followorUnfollow/${USER?._id}`, {}, { withCredentials: true });
      if (res.data.success) {
        const isFollowing = Following.includes(USER._id);
        const updatedFollowing = isFollowing ? Following.filter(id => id !== USER._id) : [...Following, USER._id];
        dispatch(setFollowing(updatedFollowing));
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error("Action failed");
    }
  };

  const likeOrUnlikeHandler = async () => {
    try {
      const action = liked ? "unlike" : "like";
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/post/${post?._id}/${action}`, { withCredentials: true });
      if (res.data.success) {
        setpostLikes(liked ? postLikes - 1 : postLikes + 1);
        setliked(!liked);
        const updatedPostData = posts.map((p) => p._id === post._id ? { ...p, likes: liked ? p.likes.filter(id => id !== user._id) : [...p.likes, user._id] } : p);
        dispatch(setPosts(updatedPostData));
      }
    } catch (error) {
      toast.error("Could not process like");
    }
  };

  const SavePostHandler = async () => {
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/v1/post/${post?._id}/save`, {}, { withCredentials: true });
      if (res.data.success) {
        const isSaved = SavedPosts.includes(post?._id);
        const updatedSavedPosts = isSaved ? SavedPosts.filter(id => id !== post._id) : [...SavedPosts, post._id];
        dispatch(setSavedPosts(updatedSavedPosts));
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error("Error saving post");
    }
  };

  const deletePostHandler = async () => {
    try {
      const res = await axios.delete(`${import.meta.env.VITE_API_URL}/api/v1/post/delete/${post?._id}`, { withCredentials: true });
      if (res.data.success) {
        dispatch(setPosts(posts.filter(p => p?._id !== post._id)));
        toast.success("Post deleted");
      }
    } catch (error) {
      toast.error("Delete failed");
    }
  };

  return (
    <div className={`mx-auto mb-10 transition-all duration-500 ${Show ? "w-full" : "w-full max-w-[550px] md:ml-[20%] lg:ml-[22%]"}`}>
      <div className="bg-[#0f0f0f] border border-white/5 rounded-[2rem] overflow-hidden shadow-2xl">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 px-5">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 border-2 border-red-500/20 p-0.5 rounded-full cursor-pointer hover:scale-105 transition-transform" onClick={() => navigate(`/profile/${post?.author?._id}`)}>
              <AvatarImage src={post.author?.ProfilePicture} className="rounded-full object-cover" />
              <AvatarFallback className="bg-white/10 text-white">CN</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <h1 className="text-sm font-bold text-white cursor-pointer hover:text-red-400" onClick={() => navigate(`/profile/${post?.author?._id}`)}>
                  {post.author?.username}
                </h1>
                {user?._id === post?.author?._id && <Badge className="bg-white/10 text-[10px] text-gray-400 border-none">You</Badge>}
              </div>
              <p className="text-[10px] text-gray-500 font-medium tracking-wider uppercase">Original Content</p>
            </div>
          </div>
          
          <Dialog>
            <DialogTrigger asChild><MoreHorizontal className="text-gray-400 cursor-pointer hover:text-white" /></DialogTrigger>
            <DialogContent className="bg-[#121212] border-white/10 text-white rounded-3xl w-64 p-2">
              <div className="flex flex-col gap-1">
                <Button variant="ghost" onClick={SavePostHandler} className="justify-start gap-3 rounded-2xl hover:bg-white/5"><Bookmark size={16}/> {SavedPosts.includes(post?._id) ? "Unsave" : "Save"}</Button>
                {user?._id === post?.author?._id ? (
                  <Button variant="ghost" onClick={deletePostHandler} className="justify-start gap-3 rounded-2xl hover:bg-red-500/10 text-red-500"><Trash2 size={16}/> Delete</Button>
                ) : (
                  <Button variant="ghost" className="justify-start gap-3 rounded-2xl hover:bg-red-500/10 text-red-500"><AlertCircle size={16}/> Report</Button>
                )}
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Post Image */}
        <div className="relative group overflow-hidden bg-black aspect-square">
          <img 
            onDoubleClick={likeOrUnlikeHandler}
            src={post.image} 
            alt="post_content" 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-transparent to-black/40 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>

        {/* Action Bar */}
        <div className="p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-5">
              <button onClick={likeOrUnlikeHandler} className="transition-transform active:scale-125">
                {liked ? <FaHeart size={24} className="text-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.4)]" /> : <FaRegHeart size={24} className="text-white hover:text-red-400" />}
              </button>
              <button onClick={() => { dispatch(setSelectedPost(post)); setopenComments(true); }} className="text-white hover:text-blue-400 transition-colors">
                <MessageCircle size={24} />
              </button>
              <button onClick={() => { setOpenShareDialog(true); dispatch(setSelectedPost(post)); }} className="text-white hover:text-green-400 transition-colors">
                <Share2 size={24} />
              </button>
              <SendDialog OpenDialog={OpenShareDialog} setOpen={setOpenShareDialog} />
            </div>
            <button onClick={SavePostHandler}>
              {SavedPosts?.includes(post?._id) ? <FaBookmark size={22} className="text-yellow-500" /> : <Bookmark size={22} className="text-white" />}
            </button>
          </div>

          {/* Engagement Metadata */}
          <div className="space-y-1">
            <p className="text-sm font-black text-white">{postLikes.toLocaleString()} likes</p>
            <p className="text-sm text-gray-300 leading-relaxed">
              <span className="font-bold text-white mr-2">{post.author?.username}</span>
              {post.caption}
            </p>
            {post.comments?.length > 0 && (
              <button onClick={() => { dispatch(setSelectedPost(post)); setopenComments(true); }} className="text-xs text-gray-500 font-semibold hover:text-gray-300 transition-colors pt-1">
                View all {post.comments.length} comments
              </button>
            )}
          </div>

          {/* Inline Comment Input */}
          <div className="mt-5 pt-4 border-t border-white/5 flex items-center gap-3">
            <input 
              type="text" 
              placeholder="Add a thought..." 
              value={CommentText}
              onChange={changeEventHandler}
              className="bg-transparent border-none outline-none text-sm text-white w-full placeholder:text-gray-600"
            />
            {CommentText.trim() && (
              <button onClick={() => { /* Logic is in parent or add it here */ }} className="text-red-500 text-xs font-black uppercase tracking-widest hover:text-red-400">
                Post
              </button>
            )}
          </div>
        </div>
      </div>
      <CommentDialog openComments={openComments} setopenComments={setopenComments} />
    </div>
  );
};

export default Post;