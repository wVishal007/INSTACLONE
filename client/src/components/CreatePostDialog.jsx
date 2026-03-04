import React, { useRef, useState } from 'react'
import { Dialog, DialogContent, DialogHeader } from './ui/dialog'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Textarea } from './ui/textarea'
import { Button } from './ui/button'
import { readFileAsDataURL } from '../lib/utils';
import { Loader2, X, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { setPosts } from '../redux/postSlice';

const CreatePostDialog = ({ open, setOpen }) => {
  const [loading, setloading] = useState(false)
  const imageRef = useRef();
  const [file, setfile] = useState("")
  const [caption, setcaption] = useState("")
  const [imgPreview, setimgPreview] = useState("")
  const { user } = useSelector(store => store.auth)
  const { posts } = useSelector(store => store.post)
  const dispatch = useDispatch();

  const fileChangeHandler = async (e) => {
    const File = e.target.files?.[0];
    if (File) {
      setfile(File)
      const dataUrl = await readFileAsDataURL(File)
      setimgPreview(dataUrl)
    }
  }

  const createPostHandler = async (e) => {
    const formData = new FormData()
    formData.append("caption", caption)
    if (imgPreview) {
      formData.append("image", file)
    }
    try {
      setloading(true)
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/v1/post/addpost`, formData, {
        headers: { "Content-Type": 'multipart/form-data' },
        withCredentials: true
      })
      if (res.data.success) {
        toast.success(res.data.message);
        dispatch(setPosts([res.data.post, ...posts]));
        // Reset State
        setfile(null)
        setcaption('')
        setimgPreview("")
        setOpen(false)
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong")
    } finally {
      setloading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent 
        className="bg-[#0a0a0a]/95 backdrop-blur-2xl border-white/10 text-white sm:max-w-[500px] p-0 overflow-hidden rounded-3xl"
        onInteractOutside={() => setOpen(false)}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/5">
           <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-white transition-colors">
              <X size={20} />
           </button>
           <h2 className="text-sm font-black uppercase tracking-[0.2em]">Create Post</h2>
           <div className="w-5" /> {/* Spacer for centering */}
        </div>

        <div className="p-6 space-y-4">
          {/* User Profile Info */}
          <div className='flex gap-3 items-center mb-2'>
            <Avatar className="h-10 w-10 border border-white/10">
              <AvatarImage src={user?.profilePicture} alt={user?.username} />
              <AvatarFallback className="bg-white/10">{user?.username?.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <h1 className='text-sm font-bold'>{user?.username}</h1>
              <span className='text-gray-500 text-[10px] uppercase font-black tracking-widest'>Original Content</span>
            </div>
          </div>

          {/* Caption Area */}
          <Textarea 
            value={caption} 
            onChange={(e) => setcaption(e.target.value)} 
            className='bg-transparent border-none text-lg placeholder:text-gray-700 resize-none p-0 focus-visible:ring-0 min-h-[100px]' 
            placeholder='What is on your mind?' 
          />

          {/* Image Preview Area */}
          {imgPreview ? (
            <div className='relative w-full aspect-square rounded-2xl overflow-hidden border border-white/10 group'>
              <img className='object-cover w-full h-full transition-transform duration-500 group-hover:scale-105' src={imgPreview} alt="Preview" />
              <button 
                onClick={() => {setimgPreview(""); setfile(null)}}
                className="absolute top-3 right-3 p-2 bg-black/60 backdrop-blur-md rounded-full text-white hover:bg-red-600 transition-all"
              >
                <X size={16} />
              </button>
            </div>
          ) : (
            /* Upload Placeholder */
            <div 
              onClick={() => imageRef.current.click()}
              className="w-full aspect-video rounded-2xl border-2 border-dashed border-white/10 flex flex-col items-center justify-center gap-3 cursor-pointer hover:bg-white/5 hover:border-white/20 transition-all group"
            >
              <div className="p-4 bg-white/5 rounded-full group-hover:scale-110 transition-transform">
                 <ImageIcon className="text-gray-500 group-hover:text-red-500" size={32} />
              </div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Select from device</p>
            </div>
          )}

          <input ref={imageRef} onChange={fileChangeHandler} type="file" className='hidden' />

          {/* Footer Actions */}
          <div className='pt-4'>
            {loading ? (
              <Button disabled className='w-full bg-red-600 h-12 rounded-2xl'>
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                Publishing...
              </Button>
            ) : (
              <Button 
                onClick={createPostHandler} 
                disabled={!caption && !imgPreview}
                className={`w-full h-12 rounded-2xl font-black uppercase tracking-widest transition-all ${
                  (caption || imgPreview) 
                  ? "bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-900/20" 
                  : "bg-white/5 text-gray-600 cursor-not-allowed"
                }`}
              >
                Post
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default CreatePostDialog