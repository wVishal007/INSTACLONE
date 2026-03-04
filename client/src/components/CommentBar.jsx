import React from 'react'
import { useSelector } from 'react-redux'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'

const CommentBar = ({ Comment }) => {
  // Ensure we don't crash if author data is missing during a real-time update
  const author = Comment?.author;

  return (
    <div className='group py-2 transition-all duration-300'>
      <div className='flex gap-3 items-start px-2'>
        {/* User Avatar */}
        <Avatar className="h-8 w-8 border border-white/5 shadow-sm">
          <AvatarImage 
            className='object-cover' 
            src={author?.ProfilePicture || author?.profilePicture} 
          />
          <AvatarFallback className="bg-white/5 text-[10px]">
            {author?.username?.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>

        {/* Comment Content */}
        <div className='flex flex-col flex-1 gap-0.5'>
          <div className='flex items-baseline gap-2'>
            <h1 className='font-black text-xs tracking-tight text-white'>
              {author?.username}
            </h1>
            <span className='text-[10px] text-gray-600 font-bold uppercase tracking-tighter'>
              Just now
            </span>
          </div>
          
          <p className='text-sm text-gray-300 leading-snug font-medium'>
            {Comment?.text}
          </p>
        </div>
      </div>

      {/* Subtle Separator */}
      <div className='mt-3 mx-4 h-[1px] bg-gradient-to-r from-transparent via-white/5 to-transparent' />
    </div>
  )
}

export default CommentBar