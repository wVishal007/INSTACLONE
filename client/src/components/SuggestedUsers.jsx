import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { AvatarImage, Avatar, AvatarFallback } from './ui/avatar'
import { setFollowing } from '../redux/authSlice'
import { toast } from 'sonner'
import axios from 'axios'

const SuggestedUsers = () => {
  const { SuggestedUsers,Following } = useSelector((store) => store.auth)
  const dispatch = useDispatch()

    const FollowUnfollowHandler = async (USER) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/v1/user/followorUnfollow/${USER?._id}`,
        {},
        { withCredentials: true }
      );
      if (res.data.success) {
        const updatedFollowing = Following?.includes(USER._id)
          ? Following.filter((id) => id !== USER._id) 
          : [...Following, USER._id]; 
        dispatch(setFollowing(updatedFollowing));
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.response.data);
    }
  };

  useEffect(() => {
}, [SuggestedUsers]);

  return (
    <div className="my-10 w-full max-w-md mx-auto">
      <div className="flex items-center justify-between mb-4 px-4">
        <h1 className="font-semibold text-gray-700 text-base">Suggested for you</h1>
        <button className="text-blue-500 text-sm font-bold hover:scale-110 hover:underline cursor-pointer">See All</button>
      </div>

      {SuggestedUsers && SuggestedUsers.length > 0 ? (
        SuggestedUsers.map((user) => (
          <div
            key={user._id}
            className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition rounded-lg bg-gray-50"
          >
            <div className="flex items-center gap-3">
              <Link to={`/profile/${user._id}`}>
                <Avatar>
                  <AvatarImage
                    className="w-10 h-10 rounded-full object-cover"
                    src={user.ProfilePicture}
                    alt={user.username}
                  />
                  <AvatarFallback>{user.username?.charAt(0)}</AvatarFallback>
                </Avatar>
              </Link>
              <div className="flex flex-col">
                <Link to={`/profile/${user._id}`}>
                  <h2 className="text-sm font-semibold hover:underline">{user.username}</h2>
                </Link>
                <p className="text-xs text-gray-500 line-clamp-1">{user?.bio} Bio here</p>
              </div>
            </div>
            {
              Following?.includes(user?._id) ? (<button onClick={()=>FollowUnfollowHandler(user)} className="text-sm font-bold cursor-pointer text-blue-500 hover:text-blue-600 transition">Unfollow</button>):(<button onClick={()=>FollowUnfollowHandler(user)} className="text-sm font-bold cursor-pointer text-blue-500 hover:text-blue-600 transition">Follow</button>)
            }
          </div>
        ))
      ) : (
        <p className="text-sm text-gray-500 px-4 mt-4">No suggestions available.</p>
      )}
    </div>
  )
}

export default SuggestedUsers
