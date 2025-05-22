// utils/handlers.js
import axios from "axios";
import { toast } from "sonner";
import { setPosts } from "../redux/postSlice"; // ✅ adjust path if needed

/**
 * Handles liking or unliking a post
 * @param {Object} params
 * @param {Object} params.post - the post object
 * @param {Boolean} params.liked - current like state
 * @param {Function} params.setLiked - state setter for like
 * @param {Number} params.postLikes - current like count
 * @param {Function} params.setPostLikes - setter for like count
 * @param {Array} params.posts - current post list
 * @param {Function} params.dispatch - redux dispatch
 * @param {Object} params.user - current user object
 */
export const LikeHandler = async ({
  post,
  liked,
  setLiked,
  postLikes,
  setPostLikes,
  posts,
  dispatch,
  user,
}) => {
  try {
    const action = liked ? "unlike" : "like";

    const res = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/v1/post/${post?._id}/${action}`,
      { withCredentials: true }
    );

    if (res.data.success) {
      const updatedLikes = liked ? postLikes - 1 : postLikes + 1;
      setPostLikes(updatedLikes);
      setLiked(!liked);

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
    toast.error(error?.response?.data?.message || "Something went wrong");
  }
};
