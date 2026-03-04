import React, { useEffect } from 'react';
import { Dialog, DialogContent } from './ui/dialog';
import { Button } from './ui/button';
import { X, Trash2 } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'sonner';
import axios from 'axios';
import { setStories, setmyStories } from '../redux/authSlice';

const StoryViewer = ({ open, setOpen, story }) => {
  const { user, myStories, stories } = useSelector(store => store.auth);
  const dispatch = useDispatch();

  // Auto-close logic (Standard 5-second story)
  useEffect(() => {
    let timer;
    if (open) {
      timer = setTimeout(() => {
        setOpen(false);
      }, 5000);
    }
    return () => clearTimeout(timer);
  }, [open, setOpen]);

  const storyDeleteHandler = async () => {
    try {
      const res = await axios.delete(`${import.meta.env.VITE_API_URL}/api/v1/story/delete/${story._id}`, {
        withCredentials: true
      });
      if (res.data.success) {
        toast.success("Story deleted");
        // Update local state
        dispatch(setmyStories(myStories.filter(s => s._id !== story._id)));
        dispatch(setStories(stories.filter(s => s._id !== story._id)));
        setOpen(false);
      }
    } catch (error) {
      toast.error("Failed to delete story");
    }
  };

  if (!story) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent 
        className='p-0 border-none bg-black md:max-w-[450px] md:h-[80vh] h-screen overflow-hidden flex flex-col items-center justify-center'
        onInteractOutside={() => setOpen(false)}
      >
        {/* Progress Bar Container */}
        <div className="absolute top-2 left-0 w-full px-2 flex gap-1 z-50">
          <div className="h-1 bg-white/20 flex-1 rounded-full overflow-hidden">
            <div className="h-full bg-white animate-story-progress origin-left" />
          </div>
        </div>

        {/* Header: User Info */}
        <div className='absolute top-6 left-0 w-full px-4 flex items-center justify-between z-50 bg-gradient-to-b from-black/60 to-transparent pb-10'>
          <div className='flex items-center gap-3'>
            <Avatar className='w-10 h-10 border border-white/20 shadow-lg'>
              <AvatarImage className="object-cover" src={story?.author?.profilePicture || user?.profilePicture} />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
            <div className='flex flex-col'>
              <span className='text-white font-bold text-sm drop-shadow-md'>
                {story?.author?.username || user?.username}
              </span>
              <span className='text-white/60 text-[10px] uppercase font-black tracking-widest'>
                Active Story
              </span>
            </div>
          </div>

          <div className='flex items-center gap-2'>
            {story?.author?._id === user?._id && (
              <button 
                onClick={storyDeleteHandler} 
                className='p-2 bg-black/40 hover:bg-red-600/80 backdrop-blur-md rounded-full text-white transition-all'
              >
                <Trash2 size={18} />
              </button>
            )}
            <button 
              onClick={() => setOpen(false)} 
              className='p-2 bg-black/40 hover:bg-white/10 backdrop-blur-md rounded-full text-white transition-all'
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Main Image */}
        <div className='w-full h-full flex items-center justify-center bg-black'>
          <img 
            className='max-h-full max-w-full object-contain' 
            src={story?.image} 
            alt="User story" 
          />
        </div>

        {/* Mobile Style: Bottom interaction space if needed */}
        <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
      </DialogContent>
    </Dialog>
  );
};

export default StoryViewer;