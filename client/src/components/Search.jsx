import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { Input } from './ui/input'
import { FaSearch } from 'react-icons/fa'

const Search = () => {
  const { posts } = useSelector(store => store.post)
  const [searchTerm, setSearchTerm] = useState('') // still used to control input

  return (
    <div className="min-h-screen bg-white">
      {/* Search Bar (Visual Only) */}
      <div className="sticky top-0 z-10 bg-white p-4 flex justify-center shadow-sm">
        <div className="relative w-full max-w-xl">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
          <Input
            type="text"
            placeholder="Search images..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Masonry Layout for All Posts */}
      <div className="columns-2 md:pl-[17%] sm:columns-2 md:columns-3 lg:columns-4 gap-4 p-4 space-y-4">
        {posts.map(post => (
          <div
            key={post._id}
            className="break-inside-avoid overflow-hidden rounded-lg shadow-md"
          >
            <img
              src={post?.image}
              alt={post?.title || 'image'}
              className="w-full object-cover rounded-lg transition-transform duration-300 hover:scale-105"
            />
          </div>
        ))}
      </div>
    </div>
  )
}

export default Search
