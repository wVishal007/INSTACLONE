import { useSelector } from 'react-redux'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Link } from 'react-router-dom'
import React from 'react'
import SuggestedUsers from './SuggestedUsers'

function RightSideBar() {
  const { user } = useSelector((store) => store.auth)
  return (
    <div className="w-full hidden md:block max-w-xs mx-auto px-4">
      {/* Current User Info */}
      <div className="flex items-center gap-4 mt-10 mb-6">
        <Link to={`/profile/${user?._id}`}>
          <Avatar>
            <AvatarImage
              className="w-10 h-10 rounded-full object-cover"
              src={user?.profilePicture}
              alt={user?.username}
            />
            <AvatarFallback>{user?.username?.charAt(0)}</AvatarFallback>
          </Avatar>
        </Link>

        <div className="flex flex-col">
          <Link to={`/profile/${user?._id}`} className="hover:underline">
            <h1 className="text-sm font-semibold">{user?.username}</h1>
          </Link>
          <span className="text-xs text-gray-500 line-clamp-1">{user?.bio}</span>
        </div>
      </div>

      {/* Suggested Users */}
      <SuggestedUsers />
    </div>
  )
}

export default RightSideBar
