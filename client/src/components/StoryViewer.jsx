import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogClose,
} from './ui/dialog';
import { Button } from './ui/button';
import { X } from 'lucide-react';
import { DialogTrigger } from '@radix-ui/react-dialog';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { useSelector } from 'react-redux';

const StoryViewer = ({ open, setOpen, story }) => {
  // Return null if dialog is closed or story is invalid
  if (!open || !story || !story.image) return null;
  const {user} = useSelector(Store=>Store.auth)

  const storyDeleteHandler =async()=>{

  }

  return (

<Dialog open={open}>
<DialogTrigger></DialogTrigger>
<DialogClose><X className='text-white'/></DialogClose>
<DialogContent onInteractOutside={()=>{setOpen(false)}} className='bg-white/5 border-none w-full md:max-w-[500px] md:h-fit h-full rouned-lg p-3'>
  <div className='relative w-full flex items-center h-full'>
    <span className='flex gap-2'>
      <Avatar className='w-13 h-13 absolute top-0'>
        <AvatarImage src={story?.author?.ProfilePicture || user.profilePicture}/>
        <AvatarFallback>U</AvatarFallback>
      </Avatar>
      <span className='text-white font-semibold text-sm absolute top-3 left-15'>{story?.author?.username || user.username}</span>
     {
      story.author?._id === user._id &&  <button onClick={storyDeleteHandler} className='absolute top-3 right-20 bg-white rounded-lg p-1 px-2 font-bold text-xs'>Delete</button>
     }
      <X onClick={()=>{setOpen(false)}} className='text-white font-bold absolute top-3 border border-black right-1 w-8 h-8'/>
    </span>
    <img className='object-cover' src={story?.image} alt="" />
  </div>
</DialogContent>
</Dialog>
  );
};

export default StoryViewer;
