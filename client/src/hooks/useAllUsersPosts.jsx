import { useEffect } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { setPosts } from "../redux/postSlice";

const useAllUsersPosts = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchAllPosts = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/post/all`, {
          withCredentials: true,
        });

        if (res.data.success) {
          dispatch(setPosts(res.data.posts)); // ✅ Already sorted
        }
      } catch (error) {
        console.log("Error fetching posts", error);
      }
    };

    fetchAllPosts();
  }, [dispatch]);
};

export default useAllUsersPosts;
