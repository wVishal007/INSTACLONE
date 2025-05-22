import React from 'react'
import { Dialog, DialogContent, DialogTrigger } from './ui/dialog'
import { useSelector } from 'react-redux'
import { Heart, LucideHeart, MessageCircleDashed } from 'lucide-react'
import {FaHeart} from 'react-icons/fa'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar.jsx'

const PostZoomDIalog = ({Open,setOpen,item,POSTER}) => {
    const {user,Following} = useSelector(store=>store.auth)
  return (
    <div>
      {
     <Dialog open={Open}>
        <DialogTrigger asChild></DialogTrigger>
        <DialogContent className='bg-white flex justify-center md:scale-70 w-fit max-w-screen items-center p-2 rounded-lg' onInteractOutside={()=>setOpen(false)}>
            <div className='flex flex-col gap-4'>
                <div className='flex gap-2 items-center'>
                    <Avatar >
                       <AvatarImage className='object-cover' src={POSTER?.ProfilePicture}/> 
                     
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <span className='font-semibold'>{POSTER?.username}</span>
                    { POSTER?.username != user?.username && (
                        Following.includes(POSTER?._id) ? (<button className='text-xs font-semibold mx-2 rounded-lg bg-gray-200 text-black px-3 py-1 focus-visible:ring-transparent border-none'>Unfollow</button>):(<button className='text-xs font-semibold mx-2 rounded-lg bg-blue-800 border-none focus-visible:ring-transparent text-white px-3 py-1'>Follow</button>))
                    }
                </div>
                <img className='object-cover rounded-lg' src={item?.image} alt="" />
                <div className='flex gap-3'>
                    {
                        item?.likes?.includes(user?._id) ? (<span className='flex gap-1'><FaHeart className='w-6 h-6 text-red-600'/>{item?.likes?.length > 0 && item?.likes?.length} likes</span>):(<span className='flex gap-1'><Heart/>{item?.likes?.length > 0 && item?.likes?.length} likes</span>)
                    }
                    
                    <span className='flex gap-1'><MessageCircleDashed
                    />{item?.comments?.length > 0 && item?.comments?.length} Comments</span>
                    </div>
                      <span className='text-sm font-semibold text-gray-600'>''{item?.caption}''</span>
                <div>
                    {
                       item?.comments?.length > 0 ?( item?.comments?.map((item)=>{
                            return (
                                <div className='flex my-1 gap-2'></div>
                            )
                        })):(
                            <span>be the first to comment</span>
                        )
                    }
                </div>
            </div>
        </DialogContent>
      </Dialog>
      }
    </div>
  )
}

export default PostZoomDIalog
