import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { Input } from './ui/input'
import { FaSearch } from 'react-icons/fa'
import { Heart, MessageCircle } from 'lucide-react'

const Search = () => {
  const { posts } = useSelector(store => store.post)
  const [searchTerm, setSearchTerm] = useState('')

  // Filter logic (optional, but good for UX)
  const filteredPosts = posts.filter(post => 
    post.caption?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    post.author?.username?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      {/* Search Header */}
      <div className="sticky top-0 z-30 bg-[#050505]/80 backdrop-blur-xl p-6 flex justify-center border-b border-white/5">
        <div className="relative w-full max-w-2xl group">
          <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 group-focus-within:text-red-500 transition-colors" />
          <Input
            type="text"
            placeholder="Search creators, vibes, or moments..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="pl-12 pr-6 py-6 rounded-2xl bg-white/5 border-white/10 text-white placeholder:text-gray-600 focus:ring-red-500/50 focus:border-red-500/50 transition-all duration-300"
          />
        </div>
      </div>

      {/* Masonry Layout */}
      <div className="max-w-[1400px] mx-auto md:pl-[20%] lg:pl-[18%] p-4 md:p-8">
        <div className="columns-2 sm:columns-3 lg:columns-4 gap-4 space-y-4">
          {filteredPosts.map(post => (
            <div
              key={post._id}
              className="relative break-inside-avoid group cursor-pointer rounded-2xl overflow-hidden border border-white/5 bg-white/5"
            >
              {/* Post Image */}
              <img
                src={post?.image}
                alt={post?.caption || 'Explore post'}
                className="w-full object-cover transition-transform duration-700 group-hover:scale-110"
              />

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-4">
                <div className="flex items-center justify-between">
                   <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1 text-sm font-bold">
                        <Heart size={16} className="fill-red-500 text-red-500" />
                        <span>{post.likes?.length}</span>
                      </div>
                      <div className="flex items-center gap-1 text-sm font-bold">
                        <MessageCircle size={16} className="text-white" />
                        <span>{post.comments?.length}</span>
                      </div>
                   </div>
                   <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                     @{post.author?.username}
                   </span>
                </div>
              </div>

              {/* Subtle gradient to make bottom text readable on hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            </div>
          ))}
        </div>

        {filteredPosts.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-gray-600">
            <FaSearch size={40} className="mb-4 opacity-20" />
            <p className="text-lg font-medium">No results for "{searchTerm}"</p>
            <p className="text-sm">Try searching for something else!</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Search