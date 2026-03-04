import React, { useState } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import useGetUserProfile from "../hooks/useGetUserProfile ";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { AtSign, Heart, MessageCircle, Settings, Grid, Bookmark, Film, Tag, LogOut } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import { setAuthUser, setFollowing, setmyStories, setSelectedUser, setStories, setSuggestedUsers, setuserProfile } from "../redux/authSlice";
import { setPosts, setSavedPosts, setSelectedPost } from "../redux/postSlice";
import { setCommentNotification, setlikeNotifications } from "../redux/RTN";
import PostZoomDIalog from "./PostZoomDIalog";
import { setMessages, setOnlineUsers } from "../redux/chatSlice";

const Profile = () => {
  const params = useParams();
  const userID = params.id;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { Following, userProfile, user } = useSelector((store) => store.auth);
  useGetUserProfile(userID);

  const isLoggedinUser = user?._id === userProfile?._id;
  const [ActiveTab, setActiveTab] = useState("posts");
  const [Zoom, setZoom] = useState(false);
  const [ZoomedPost, setZoomedPost] = useState({});

  const DisplayedPosts = ActiveTab === "posts" ? userProfile?.posts : userProfile?.saved;

  const FollowUnfollowHandler = async () => {
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/v1/user/followorUnfollow/${userProfile?._id}`, {}, { withCredentials: true });
      if (res.data.success) {
        const updatedFollowing = Following.includes(userProfile._id)
          ? Following.filter((id) => id !== userProfile._id)
          : [...Following, userProfile._id];
        dispatch(setFollowing(updatedFollowing));
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error("Action failed");
    }
  };

  const LogOutHandler = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/user/logout`, { withCredentials: true });
      if (res.data.success) {
        [setAuthUser(null), setSelectedPost(null), setPosts([]), setFollowing([]), setlikeNotifications([]), setSuggestedUsers([]), setSelectedUser(null), setCommentNotification([]), setStories([]), setmyStories([]), setOnlineUsers([]), setMessages([]), setuserProfile(null), setSavedPosts([])].forEach(dispatch);
        navigate("/login");
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error("Logout failed");
    }
  };

  const PostZoomHandler = (post) => {
    setZoom(true);
    setZoomedPost(post);
  };

  return (
    <div className="min-h-screen w-full md:pl-[20%] lg:pl-[18%] bg-[#050505] text-white transition-all duration-500">
      <div className="max-w-4xl mx-auto pt-10 px-6">
        
        {/* Profile Header */}
        <header className="flex flex-col md:flex-row items-center md:items-start gap-10 mb-12">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-tr from-red-600 to-purple-600 rounded-full blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
            <Avatar className="h-32 w-32 md:h-44 md:w-44 border-[6px] border-[#050505] relative shadow-2xl">
              <AvatarImage className="object-cover" src={userProfile?.ProfilePicture} />
              <AvatarFallback className="bg-white/10 text-2xl">UP</AvatarFallback>
            </Avatar>
          </div>

          <section className="flex-1 space-y-6 text-center md:text-left">
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <h2 className="text-2xl font-black tracking-tight">{userProfile?.username}</h2>
              <div className="flex items-center justify-center md:justify-start gap-2">
                {isLoggedinUser ? (
                  <>
                    <Link to="/account/edit">
                      <Button variant="secondary" className="bg-white/10 hover:bg-white/20 text-white rounded-xl px-6 font-bold text-xs uppercase tracking-widest border-none">Edit Profile</Button>
                    </Link>
                    <Button onClick={LogOutHandler} className="bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-xl p-2 px-3 transition-all"><LogOut size={18}/></Button>
                  </>
                ) : (
                  <div className="flex gap-2">
                    <Button 
                      onClick={FollowUnfollowHandler}
                      className={`rounded-xl px-8 font-bold text-xs uppercase tracking-widest transition-all ${Following.includes(userProfile?._id) ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-blue-600 text-white hover:bg-blue-500'}`}
                    >
                      {Following.includes(userProfile?._id) ? "Unfollow" : "Follow"}
                    </Button>
                    <Button onClick={() => { navigate(`/chat/`); dispatch(setSelectedUser(userProfile)); }} className="bg-white text-black hover:bg-gray-200 rounded-xl px-8 font-bold text-xs uppercase tracking-widest">Message</Button>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center justify-center md:justify-start gap-8 border-y border-white/5 py-4">
              <div className="text-center md:text-left"><span className="block text-lg font-black">{userProfile?.posts?.length || 0}</span><span className="text-[10px] text-gray-500 font-bold uppercase tracking-tighter">Posts</span></div>
              <div className="text-center md:text-left"><span className="block text-lg font-black">{userProfile?.followers?.length || 0}</span><span className="text-[10px] text-gray-500 font-bold uppercase tracking-tighter">Followers</span></div>
              <div className="text-center md:text-left"><span className="block text-lg font-black">{userProfile?.following?.length || 0}</span><span className="text-[10px] text-gray-500 font-bold uppercase tracking-tighter">Following</span></div>
            </div>

            <div className="max-w-sm">
              <p className="text-sm text-gray-300 leading-relaxed font-medium mb-3">{userProfile?.Bio || "Designing the future of FRAME."}</p>
              <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-500/20 px-3 py-1 rounded-full text-[10px] font-bold">
                <AtSign size={10} className="mr-1"/> {userProfile?.username}
              </Badge>
            </div>
          </section>
        </header>

        {/* Tab Navigation */}
        <div className="flex justify-center border-t border-white/5">
          {[
            { id: "posts", icon: <Grid size={14}/>, label: "Posts" },
            { id: "saved", icon: <Bookmark size={14}/>, label: "Saved" },
            { id: "reels", icon: <Film size={14}/>, label: "Reels" },
            { id: "tags", icon: <Tag size={14}/>, label: "Tagged" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] transition-all border-t-2 ${ActiveTab === tab.id ? 'border-white text-white' : 'border-transparent text-gray-500 hover:text-gray-300'}`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* Post Grid */}
        <div className="grid grid-cols-3 gap-1 md:gap-4 pb-20">
          {DisplayedPosts?.map((post) => (
            <div 
              key={post?._id} 
              onClick={() => PostZoomHandler(post)}
              className="relative group cursor-pointer aspect-square overflow-hidden rounded-md md:rounded-2xl bg-white/5"
            >
              <img src={post?.image} alt="post" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center gap-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="flex items-center gap-1 font-bold"><Heart size={20} fill="currentColor"/> {post.likes?.length}</div>
                <div className="flex items-center gap-1 font-bold"><MessageCircle size={20} fill="currentColor"/> {post.comments?.length}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <PostZoomDIalog 
        Open={Zoom} 
        pfp={userProfile?.ProfilePicture} 
        username={userProfile?.username} 
        setOpen={setZoom} 
        item={ZoomedPost} 
        POSTER={userProfile} 
      />
    </div>
  );
};

export default Profile;