// LikesPage.jsx
import React from 'react';
import { useSelector } from 'react-redux';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { FaRing } from 'react-icons/fa';
import { Bell } from 'lucide-react';

const NotificationPage = () => {
  const { likeNotifications } = useSelector(store => store.RealTimeNotifications);

  return (
    <div className="p-4">
      <h1 className="text-xl items-center justify-center flex gap-3 bg-gray-100 rounded-lg font-bold mb-4">Notifications <Bell/></h1>
      {likeNotifications.length === 0 ? (
        <p>No new notifications</p>
      ) : (
        likeNotifications.map((item) => (
          <div key={item.userID} className="flex items-center gap-3 mb-3">
            <Avatar>
              <AvatarImage src={item?.userDetails.ProfilePicture} />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
            <p className="text-sm">
              <span className="font-bold">{item.userDetails?.username}</span> liked your post
            </p>
          </div>
        ))
      )}
    </div>
  );
};

export default NotificationPage;
