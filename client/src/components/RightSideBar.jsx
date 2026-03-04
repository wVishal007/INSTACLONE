import { useSelector } from 'react-redux'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Link } from 'react-router-dom'
import React from 'react'
import SuggestedUsers from './SuggestedUsers'

function RightSideBar() {
  const { user } = useSelector((store) => store.auth)

  return (
    // Fixed position on desktop ensures it stays visible while scrolling the feed
    <div className="fixed top-20 right-0 w-[22%] hidden xl:block px-8 py-4">
      
      {/* User Profile Card */}
      <div className="flex items-center justify-between mb-10 p-4 rounded-3xl bg-white/5 border border-white/5 backdrop-blur-sm transition-all hover:bg-white/10 group">
        <div className="flex items-center gap-4">
          <Link to={`/profile/${user?._id}`}>
            <Avatar className="h-12 w-12 border-2 border-red-500/20 p-0.5 group-hover:border-red-500/50 transition-all">
              <AvatarImage
                className="rounded-full object-cover"
                src={user?.profilePicture}
                alt={user?.username}
              />
              <AvatarFallback className="bg-white/10 text-white">
                {user?.username?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </Link>

          <div className="flex flex-col">
            <Link to={`/profile/${user?._id}`}>
              <h1 className="text-sm font-black text-white group-hover:text-red-400 transition-colors">
                {user?.username}
              </h1>
            </Link>
            <span className="text-[11px] text-gray-500 font-medium line-clamp-1 max-w-[120px]">
              {user?.bio || "FRAME Explorer"}
            </span>
          </div>
        </div>

        {/* Tactical "Switch" Button */}
        <button className="text-[10px] font-black text-blue-500 uppercase tracking-widest hover:text-white transition-colors">
          Switch
        </button>
      </div>

      {/* Suggested Users Section */}
      <div className="relative">
        {/* Subtle decorative glow behind suggestions */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-500/5 blur-[80px] rounded-full pointer-events-none" />
        <SuggestedUsers />
      </div>
    </div>
  )
}

export default RightSideBar