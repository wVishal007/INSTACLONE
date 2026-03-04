import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { AvatarImage, Avatar, AvatarFallback } from './ui/avatar'
import { setFollowing } from '../redux/authSlice'
import { toast } from 'sonner'
import axios from 'axios'

const SuggestedUsers = () => {
  const { SuggestedUsers, Following } = useSelector((store) => store.auth)
  const dispatch = useDispatch()

  const FollowUnfollowHandler = async (USER) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/v1/user/followorUnfollow/${USER?._id}`,
        {},
        { withCredentials: true }
      );
      if (res.data.success) {
        const isFollowing = Following?.includes(USER._id);
        const updatedFollowing = isFollowing
          ? Following.filter((id) => id !== USER._id)
          : [...Following, USER._id];
        
        dispatch(setFollowing(updatedFollowing));
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Action failed");
    }
  };

  return (
    <div className="my-8 w-full max-w-sm ml-auto hidden lg:block pr-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 px-2">
        <h1 className="font-black text-gray-400 text-xs uppercase tracking-[0.15em]">
          Suggested for you
        </h1>
        <button className="text-white text-xs font-bold hover:text-red-500 transition-colors cursor-pointer">
          See All
        </button>
      </div>

      {/* User List */}
      <div className="space-y-1">
        {SuggestedUsers && SuggestedUsers.length > 0 ? (
          SuggestedUsers.map((suggestedUser) => {
            const isFollowing = Following?.includes(suggestedUser?._id);
            
            return (
              <div
                key={suggestedUser._id}
                className="flex items-center justify-between p-3 transition-all duration-300 rounded-2xl hover:bg-white/5 group"
              >
                <div className="flex items-center gap-3">
                  <Link to={`/profile/${suggestedUser._id}`}>
                    <Avatar className="h-11 w-11 border border-white/10 group-hover:border-red-500/50 transition-colors">
                      <AvatarImage
                        className="object-cover"
                        src={suggestedUser.ProfilePicture}
                        alt={suggestedUser.username}
                      />
                      <AvatarFallback className="bg-white/10 text-white">
                        {suggestedUser.username?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Link>
                  
                  <div className="flex flex-col">
                    <Link to={`/profile/${suggestedUser._id}`}>
                      <h2 className="text-sm font-bold text-white group-hover:text-red-400 transition-colors leading-none mb-1">
                        {suggestedUser.username}
                      </h2>
                    </Link>
                    <p className="text-[11px] text-gray-500 font-medium truncate w-32">
                      {suggestedUser?.bio || "FRAME Creator"}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => FollowUnfollowHandler(suggestedUser)}
                  className={`text-xs font-black uppercase tracking-widest px-4 py-2 rounded-xl transition-all ${
                    isFollowing 
                    ? "bg-white/10 text-gray-400 hover:bg-red-500/10 hover:text-red-500" 
                    : "text-blue-500 hover:text-blue-400"
                  }`}
                >
                  {isFollowing ? "Unfollow" : "Follow"}
                </button>
              </div>
            );
          })
        ) : (
          <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
            <p className="text-xs text-gray-500 text-center italic">Finding new creators...</p>
          </div>
        )}
      </div>

      {/* Footer / Copyright */}
      <footer className="mt-8 px-2">
        <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest leading-loose">
          About • Help • Press • API • Jobs • Privacy • Terms
        </p>
        <p className="text-[10px] text-gray-700 mt-4 font-black">
          © 2026 FRAME BY GOOGLE
        </p>
      </footer>
    </div>
  )
}

export default SuggestedUsers