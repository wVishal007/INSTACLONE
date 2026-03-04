import React from 'react'
import { Dialog, DialogContent } from './ui/dialog'
import { useSelector } from 'react-redux'
import { Heart, MessageCircle, X, UserPlus, UserMinus } from 'lucide-react'
import { FaHeart } from 'react-icons/fa'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar.jsx'

const PostZoomDialog = ({ Open, setOpen, item, POSTER }) => {
    const { user, Following } = useSelector(store => store.auth)
    const isLiked = item?.likes?.includes(user?._id)
    const isFollowing = Following?.includes(POSTER?._id)

    return (
        <Dialog open={Open} onOpenChange={setOpen}>
            <DialogContent 
                className='bg-[#0a0a0a]/95 backdrop-blur-3xl border-white/10 text-white max-w-[95vw] md:max-w-[800px] p-0 overflow-hidden rounded-3xl'
                onInteractOutside={() => setOpen(false)}
            >
                <div className='flex flex-col md:flex-row h-full max-h-[90vh]'>
                    
                    {/* LEFT SIDE: The Image */}
                    <div className='w-full md:w-[60%] bg-black flex items-center justify-center border-r border-white/5'>
                        <img 
                            className='max-h-[50vh] md:max-h-full w-full object-contain shadow-2xl' 
                            src={item?.image} 
                            alt="Post content" 
                        />
                    </div>

                    {/* RIGHT SIDE: Details & Comments */}
                    <div className='w-full md:w-[40%] flex flex-col p-6 overflow-hidden'>
                        
                        {/* Header */}
                        <div className='flex justify-between items-center pb-4 border-b border-white/5'>
                            <div className='flex gap-3 items-center'>
                                <Avatar className="h-10 w-10 border border-white/10">
                                    <AvatarImage className='object-cover' src={POSTER?.ProfilePicture} />
                                    <AvatarFallback>{POSTER?.username?.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div className='flex flex-col'>
                                    <span className='font-bold text-sm tracking-tight'>{POSTER?.username}</span>
                                    {POSTER?._id !== user?._id && (
                                        <button className={`text-[10px] font-black uppercase tracking-widest transition-colors ${
                                            isFollowing ? 'text-gray-500' : 'text-red-500 hover:text-red-400'
                                        }`}>
                                            {isFollowing ? 'Following' : 'Follow'}
                                        </button>
                                    )}
                                </div>
                            </div>
                            <button 
                                onClick={() => setOpen(false)} 
                                className='p-2 hover:bg-white/10 rounded-full transition-all text-gray-500 hover:text-white'
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Caption & Comments Area */}
                        <div className='flex-1 overflow-y-auto py-4 space-y-4 scrollbar-hide'>
                            {/* Caption */}
                            <div className='flex gap-3'>
                                <Avatar className="h-6 w-6 border border-white/10">
                                    <AvatarImage src={POSTER?.ProfilePicture} />
                                </Avatar>
                                <p className='text-sm leading-relaxed'>
                                    <span className='font-bold mr-2 text-red-500'>{POSTER?.username}</span>
                                    <span className='text-gray-300'>{item?.caption}</span>
                                </p>
                            </div>

                            {/* Comments List */}
                            <div className='space-y-4 pt-2'>
                                {item?.comments?.length > 0 ? (
                                    item.comments.map((comment, index) => (
                                        <div key={index} className='flex gap-3 animate-in fade-in slide-in-from-bottom-1'>
                                            <Avatar className="h-6 w-6">
                                                <AvatarImage src={comment?.author?.profilePicture} />
                                                <AvatarFallback>U</AvatarFallback>
                                            </Avatar>
                                            <p className='text-xs'>
                                                <span className='font-bold mr-2'>{comment?.author?.username}</span>
                                                <span className='text-gray-400'>{comment?.text}</span>
                                            </p>
                                        </div>
                                    ))
                                ) : (
                                    <div className='flex flex-col items-center justify-center py-10 text-gray-600'>
                                        <MessageCircle size={32} className='mb-2 opacity-20' />
                                        <span className='text-xs font-bold uppercase tracking-widest'>No comments yet</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Footer: Stats */}
                        <div className='pt-4 border-t border-white/5'>
                            <div className='flex items-center gap-4 mb-2'>
                                <button className='hover:scale-110 transition-transform'>
                                    {isLiked ? (
                                        <FaHeart className='w-6 h-6 text-red-600 shadow-red-600/50 drop-shadow-lg' />
                                    ) : (
                                        <Heart className='w-6 h-6' />
                                    )}
                                </button>
                                <button className='hover:scale-110 transition-transform'>
                                    <MessageCircle className='w-6 h-6' />
                                </button>
                            </div>
                            <div className='flex flex-col'>
                                <span className='text-sm font-black'>{item?.likes?.length || 0} Likes</span>
                                <span className='text-[10px] text-gray-500 uppercase font-black mt-1'>Posted 2 days ago</span>
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default PostZoomDialog