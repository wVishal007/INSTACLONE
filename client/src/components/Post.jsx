import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { Badge } from "./ui/badge";
import {
  Bookmark,
  BookMarked,
  Ghost,
  MessageCircle,
  MoreHorizontal,
  Send,
} from "lucide-react";
import React, { useEffect, useState } from "react";
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

const Post = ({ post }) => {
  useGetSavedPosts();
  const [CommentText, setCommentText] = useState("");
  const [openComments, setopenComments] = useState(false);
  const { user,Following } = useSelector((store) => store.auth);
  const { posts, SelectedPost, SavedPosts } = useSelector(
    (store) => store.post
  );
  const [liked, setliked] = useState(post.likes.includes(user?._id) || false);
  const [postLikes, setpostLikes] = useState(post.likes.length);
  const [Comment, setComment] = useState([]);
  const [saved, setsaved] = useState(SavedPosts);
  const navigate = useNavigate()

  const dispatch = useDispatch();

  const changeEventHandler = (e) => {
    const inputText = e.target.value;
    if (inputText.trim()) {
      setCommentText(inputText);
    } else {
      setCommentText("");
    }
  };


    const FollowUnfollowHandler = async (USER) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/v1/user/followorUnfollow/${USER?._id}`,
        {},
        { withCredentials: true }
      );
      if (res.data.success) {
        const updatedFollowing = Following.includes(USER._id)
          ? Following.filter((id) => id !== USER._id) 
          : [...Following, USER._id]; 
        dispatch(setFollowing(updatedFollowing));
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.response.data);
    }
  };

  const likeOrUnlikeHandler = async () => {
    try {
      const action = liked ? "unlike" : "like";
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/v1/post/${post?._id}/${action}`,
        { withCredentials: true }
      );
      if (res.data.success) {
        const updatedLikes = liked ? postLikes - 1 : postLikes + 1;
        setpostLikes(updatedLikes);
        setliked(!liked);

        const updatedPostData = posts.map((p) =>
          p._id === post._id
            ? {
                ...p,
                likes: liked
                  ? p.likes.filter((id) => id !== user._id)
                  : [...p.likes, user._id],
              }
            : p
        );
        dispatch(setPosts(updatedPostData));
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };

  const commentHandler = async () => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/v1/post/${post?._id}/comment`,
        { text: CommentText },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        const updatedCommentData = [...Comment, res.data.Comment];
        setComment(updatedCommentData);

        const updatedPostData = posts.map((p) =>
          p._id === post._id
            ? {
                ...p,
                comments: updatedCommentData,
              }
            : p
        );
        dispatch(setPosts(updatedPostData));

        toast.success(res.data.message);
        setCommentText("");
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const SavePostHandler = async () => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/v1/post/${post?._id}/save`,
        {},
        { withCredentials: true }
      );
      if (res.data.success) {
        const updatedSavedPosts = saved.includes(post?._id)
          ? saved.filter((id) => id !== post._id) // Remove from saved
          : [...saved, post._id]; // Add to saved

        setsaved(updatedSavedPosts);
        dispatch(setSavedPosts(updatedSavedPosts));
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const deletePostHandler = async () => {
    try {
      // alert("deleting post")
      const res = await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/v1/post/delete/${post?._id}`,
        { withCredentials: true }
      );
      if (res.data.success) {
        const updatedPostList = posts.filter(
          (postItem) => postItem?._id !== post._id
        );
        dispatch(setPosts(updatedPostList));
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.response.data.message);
      console.log(error);
    }
  };

  const [OpenShareDialog, setOpenShareDialog] = useState(false)
  return (
    <div className="my-8 w-full max-w-3xl mx-auto px-7 md:pl-[17%]">
      <div className="flex justify-between">
        <div className="flex gap-2 items-center">
          <Avatar className="cursor-pointer" onClick={()=>navigate(`/profile/${post?.author?._id}`)}>
            <AvatarImage
              className="w-8 h-8 rounded-full object-cover"
              src={post.author?.ProfilePicture}
              alt="post_image"
            />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div className="flex gap-3 items-center">
            <h1 className="cursor-pointer" onClick={()=>navigate(`/profile/${post?.author?._id}`)}>{post.author?.username}</h1>
            {user?._id === post?.author._id ? (<Badge>Author</Badge>):(
              Following.includes(post?.author?._id) ? (<Button className='rounded-lg text-black font-semibold mx-3 bg-gray-200' onClick={()=>FollowUnfollowHandler(post?.author)}>Unfollow</Button> ):(<Button className='rounded-lg font-semibold mx-3 bg-blue-600' onClick={()=>FollowUnfollowHandler(post?.author)}>Follow</Button>)
            )}
          </div>
        </div>  
          
        
        <Dialog>
          <DialogTrigger asChild>
            <MoreHorizontal className="cursor-pointer" />
          </DialogTrigger>
          <DialogContent className="flex bg-white text-sm items-center text-center gap-2 ">
            <Button onClick={SavePostHandler} className="cursor-pointer w-fit font-bold">
              Save post
            </Button>

            {user && user?._id === post?.author._id && (
              <Button
                onClick={deletePostHandler}
                className="cursor-pointer w-fit font-bold"
              >
                delete
              </Button>
            )}
            {user && user?._id !== post?.author._id && (
              <Button className="cursor-pointer w-fit font-bold">Report</Button>
            )}
          </DialogContent>
        </Dialog>
      </div>
      <img onDoubleClick={likeOrUnlikeHandler}
        className="rounded-sm object-cover aspect-square w-full my-2"
        src={post.image}
        alt=""
      />
      <div className="flex justify-between">
        <div className="flex gap-3 items-center">
          {liked ? (
            <FaHeart
              onClick={likeOrUnlikeHandler}
              className="cursor-pointer text-red-600"
              size={"24px"}
            />
          ) : (
            <FaRegHeart
              onClick={likeOrUnlikeHandler}
              className="cursor-pointer"
              size={"24px"}
            />
          )}
          <MessageCircle
            onClick={() => {
              dispatch(setSelectedPost(post));
              setopenComments(true);
            }}
            className="cursor-pointer hover:text-pink-400"
          />
          <Send onClick={()=>{
            setOpenShareDialog(true)
            dispatch(setSelectedPost(post))

          }} className="cursor-pointer hover:text-pink-400" />
            <SendDialog OpenDialog={OpenShareDialog} setOpen={setOpenShareDialog}/>
        </div>
        <div>
          {" "}
          {SavedPosts?.includes(post?._id) ? (
            <FaBookmark
              onClick={SavePostHandler}
              className="cursor-pointer hover:text-pink-400"
            />
          ) : (
            <Bookmark
              onClick={SavePostHandler}
              className="cursor-pointer hover:text-pink-400"
            />
          )}
        </div>
      </div>
      <span className="font-bold text-sm mb-2 block">{postLikes} Likes</span>
      <p>
        <span className="mr-3 font-medium">{post.author.username}</span>
        {post.caption}
      </p>
      {Comment.length > 0 && (
        <span
          className="cursor-pointer test-sm text-gray-400"
          onClick={() => {
            dispatch(setSelectedPost(post));
            setopenComments(true);
          }}
        >
          view all {Comment.length} comments
        </span>
      )}
      <CommentDialog
        openComments={openComments}
        setopenComments={setopenComments}
      />
      <div className="flex items-center justify-between">
        <input
          type="text"
          value={CommentText}
          onChange={changeEventHandler}
          placeholder="add a comment"
          className="outline-none text-sm w-full"
        />
        {CommentText && (
          <span
            onClick={commentHandler}
            className="text-[#3BADF8] cursor-pointer"
          >
            Post
          </span>
        )}
      </div>
    </div>
  );
};

export default Post;
