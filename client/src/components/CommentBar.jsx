import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar'
import React from 'react'
import { useSelector } from 'react-redux'


const CommentBar = ({Comment}) => {
    const {SelectedPost} = useSelector(store=>store.post)
  return (
    <div className='my-2'>
      <div className='flex gap-3 items-center'>
        <Avatar>
        <AvatarImage className='rounded-full w-6 h-6 object-cover' src={Comment.author.ProfilePicture} />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
      <h1 className='font-semibold text-xs'>{Comment?.author.username} <span className='font-normal text-sm mx-2 pl-1'>{Comment?.text}</span></h1>
      </div>
      <hr className='border-gray-200 my-1' />
    </div>
  )
}

export default CommentBar
