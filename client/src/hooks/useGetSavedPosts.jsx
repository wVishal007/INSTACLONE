import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import {  setSavedPosts } from "../redux/postSlice";
import { toast } from "sonner";

const useGetSavedPosts = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchSavedPosts = async () => {
      try {
        const res = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/v1/user/saved`,
          {},
          { withCredentials: true }
        );
        if (res.data.success) {
          dispatch(setSavedPosts(res.data.savedPosts));
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchSavedPosts();
  }, [setSavedPosts]);
};

export default useGetSavedPosts;
