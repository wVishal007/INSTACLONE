import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setFollowing } from "../redux/authSlice";
import { toast } from "sonner";

const useGetUsersFollowing = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchFollowing = async () => {
      try {
        const res = await axios.post(
          "https://instaclone-sje7.onrender.com/api/v1/user/saved",
          {},
          { withCredentials: true }
        );
        if (res.data.success) {
          dispatch(setFollowing(res.data.Following || []));
          // console.log(res.data.Following)
          // toast.success(res.data.message)
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchFollowing();
  }, []);
};

export default useGetUsersFollowing;
