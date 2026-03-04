import React from 'react';
import { useSelector } from 'react-redux';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Bell, Heart, BellOff } from 'lucide-react';

const NotificationPage = () => {
  const { likeNotifications } = useSelector(store => store.RealTimeNotifications);

  return (
    <div className="min-h-screen bg-[#050505] text-white flex justify-center md:ml-[18%] lg:ml-[16%]">
      <div className="w-full max-w-2xl py-12 px-6">
        
        {/* Header Section */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black tracking-tighter flex items-center gap-3">
              Activity <Bell className="text-red-600" size={28} />
            </h1>
            <p className="text-gray-500 text-sm mt-1 font-medium">
              See who's interacting with your content.
            </p>
          </div>
        </div>

        {/* Notifications List */}
        <div className="space-y-4">
          {likeNotifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-sm">
              <div className="p-4 bg-white/5 rounded-full mb-4">
                <BellOff className="text-gray-600" size={40} />
              </div>
              <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">
                No new activity yet
              </p>
            </div>
          ) : (
            likeNotifications.map((item, index) => (
              <div 
                key={index} 
                className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-red-500/30 transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <Avatar className="h-12 w-12 border border-white/10 shadow-lg">
                      <AvatarImage src={item?.userDetails?.ProfilePicture || item?.userDetails?.profilePicture} className="object-cover" />
                      <AvatarFallback className="bg-white/10">U</AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-1 -right-1 bg-red-600 rounded-full p-1 border-2 border-[#050505]">
                      <Heart size={10} fill="white" className="text-white" />
                    </div>
                  </div>
                  
                  <div className="flex flex-col">
                    <p className="text-sm">
                      <span className="font-black text-white">{item.userDetails?.username}</span>
                      <span className="text-gray-400 ml-1 font-medium">liked your post.</span>
                    </p>
                    <span className="text-[10px] text-gray-600 font-bold uppercase tracking-widest mt-0.5">
                      Just now
                    </span>
                  </div>
                </div>

                {/* Optional: Preview of the post that was liked */}
                <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 overflow-hidden hidden sm:block">
                   {/* If item.postImage exists, show it here */}
                   <div className="w-full h-full bg-gradient-to-br from-red-500/20 to-transparent" />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationPage;