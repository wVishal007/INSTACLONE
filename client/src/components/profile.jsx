import React, { useEffect, useState } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import useGetUserProfile from "../hooks/useGetUserProfile ";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { AtSign, Heart, MessageCircle } from "lucide-react";
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
  const { Following } = useSelector((store) => store.auth);
  useGetUserProfile(userID);
  const { userProfile, user } = useSelector((store) => store.auth);
  const isLoggedinUser = user?._id === userProfile?._id;
  const [ActiveTab, setActiveTab] = useState("posts");
  const navigate = useNavigate()
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const DisplayedPosts =
    ActiveTab === "posts" ? userProfile?.posts : userProfile?.saved;
  const dispatch = useDispatch();

  const FollowUnfollowHandler = async () => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/v1/user/followorUnfollow/${
          userProfile?._id
        }`,
        {},
        { withCredentials: true }
      );
      if (res.data.success) {
        const updatedFollowing = Following.includes(userProfile._id)
          ? Following.filter((id) => id !== userProfile._id)
          : [...Following, userProfile._id];
        dispatch(setFollowing(updatedFollowing));
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.response.data);
    }
  };

  const LogOutHandler = async () => {
      try {
        console.log('hello')
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/user/logout`, {
          withCredentials: true,
        });
        if (res.data.success) {
                  dispatch(setAuthUser(null));
                  dispatch(setSelectedPost(null));
                  dispatch(setPosts([]));
                  dispatch(setFollowing([]))
                  dispatch(setlikeNotifications([]))
                  dispatch(setSuggestedUsers([]))
                  dispatch(setSelectedUser(null))
                  dispatch(setCommentNotification([]))
                  dispatch(setStories([]))
                  dispatch(setmyStories([]))
                  dispatch(setOnlineUsers([]))
                  dispatch(setMessages([]))
                  dispatch(setuserProfile(null))
                  dispatch(setSavedPosts([]))
          navigate("/login");
          toast.success(res.data.message);
        }
      } catch (error) {
        console.log(error);
        toast.error(error.response.data.message);
        
        ;
      }
    };


const [Zoom, setZoom] = useState(false)
 const [ZoomedPost, setZoomedPost] = useState({})

 const PostZoomHandler = (post) =>{
setZoom(true)
 setZoomedPost(post)
}
  return (
    <div className="flex mx-auto w-screen md:max-w-5xl justify-center">
      <div className="flex flex-col p-20 gap-8">
        <div className="grid grid-cols-2">
          <section className="flex flex-col gap-5 justify-start md:justify-center  items-center">
            <Avatar className="h-20 w-20 md:h-36 md:w-36">
              <AvatarImage
                className="object-cover"
                src={userProfile?.ProfilePicture}
              />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
           {
            user?._id === userProfile?._id &&  <div onClick={LogOutHandler} className="block md:hidden cursor-pointer hover:scale-90"><Button className='bg-gray-200 text-black font-semibold rounded-lg text-sm hover:scal-90'>Logout</Button></div>
           }
          </section>
          <section className="flex flex-col gap-5">
            <div className="flex gap-5 items-center">
              <span className="font-semibold">{userProfile?.username}</span>
              {isLoggedinUser ? (
                <>
                  <Link to="/account/edit">
                    <Button
                      variant="secondary"
                      className="h-8 hover:bg-gray-300 bg-gray-100 font-semibold"
                    >
                      Edit Profile
                    </Button>
                  </Link>
                  <Button
                    variant="secondary"
                    className="h-8 hover:bg-gray-300 hidden md:block bg-gray-100 font-semibold"
                  >
                    View Archive
                  </Button>
                  <Button
                    variant="secondary"
                    className="h-8 hover:bg-gray-300 hidden md:block bg-gray-100 font-semibold"
                  >
                    Ad tools
                  </Button>
                </>
              ) : Following.includes(userProfile?._id) ? (
                <>
                  <Button
                    onClick={FollowUnfollowHandler}
                    variant="secondary"
                    className="h-8 hover:bg-gray-100 bg-gray-200 font-semibold"
                  >
                    Unfollow
                  </Button>
                  <Button onClick={()=>{navigate(`/chat/`)
                    dispatch(setSelectedUser(userProfile))
                  }}
                    variant="secondary"
                    className="h-8 hover:bg-gray-100 bg-gray-200 font-semibold"
                  >
                    Message
                  </Button>
                </>
              ) : (
                <Button
                  onClick={FollowUnfollowHandler}
                  variant="secondary"
                  className="h-8 hover:bg-blue-700 bg-blue-500 text-white font-semibold"
                >
                  Follow
                </Button>
              )}
            </div>
            <div className="flex items-center gap-4">
              <p>
                <span className="font-semibold mx-2">
                  {userProfile?.posts?.length}
                </span>{" "}
                posts
              </p>
              <p className="cursor-pointer">
                <span className="font-semibold mx-2">
                  {userProfile?.followers?.length}
                </span>{" "}
                followers
              </p>
              <p className="cursor-pointer">
                <span className="font-semibold mx-2">
                  {userProfile?.following?.length}
                </span>{" "}
                following
              </p>
            </div>
            <div className="flex flex-col gap-1">
              <span className="font-semibold">
                {userProfile?.Bio || "Bio here..."}{" "}
              </span>
              <Badge
                variant="secondary"
                className="w-fit bg-gray-300 text-black mx-2 font-medium"
              >
                <AtSign /> {userProfile?.username}
              </Badge>
            </div>
          </section>
        </div>

        <div className="border-t border-t-gray-200">
          <div className="flex items-center justify-center gap-10 text-sm">
            <span
              className={`py-3 cursor-pointer ${
                ActiveTab === "posts" ? "font-bold" : ""
              }`}
              onClick={() => handleTabChange("posts")}
            >
              POSTS
            </span>
            <span
              className={`py-3 cursor-pointer ${
                ActiveTab === "saved" ? "font-bold" : ""
              }`}
              onClick={() => handleTabChange("saved")}
            >
              SAVED
            </span>
            <span
              className={`py-3 cursor-pointer ${
                ActiveTab === "reels" ? "font-bold" : ""
              }`}
              onClick={() => handleTabChange("reels")}
            >
              REELS
            </span>
            <span
              className={`py-3 cursor-pointer ${
                ActiveTab === "tags" ? "font-bold" : ""
              }`}
              onClick={() => handleTabChange("tags")}
            >
              TAGS
            </span>
          </div>
<PostZoomDIalog Open = {Zoom} pfp={userProfile?.ProfilePicture} username={userProfile?.username} setOpen={setZoom} item={ZoomedPost} POSTER={userProfile} />
          <div className="grid grid-cols-3 gap-1">
            {DisplayedPosts ?.map((post) => {
              return (
                <div onClick={()=>PostZoomHandler(post)} key={post?._id} className="cursor-pointer relative group">
                  <img
                    src={post?.image}
                    alt="postimage"
                    className="rounded-sm my-2 w-full aspect-square object-cover"
                  />
                  <div className="absolute inset-0 flex gap-5 items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="flex items-center text-white gap-5">
                      <button className="flex items-center gap-1">
                        <Heart className="text-white" />
                        <span className="text-white">{post.likes?.length}</span>
                      </button>
                      <button className="flex items-center gap-1">
                        <MessageCircle className="text-white" />
                        <span className="text-white">
                          {post.comments?.length}
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
