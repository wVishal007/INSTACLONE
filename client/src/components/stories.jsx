import React, { useRef, useState, useEffect } from 'react';
import * as Avatar from '@radix-ui/react-avatar';
import * as Dialog from '@radix-ui/react-dialog';
import { ScrollText, PlusCircle } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { toast } from 'sonner';
import { setmyStories, setStories } from '../redux/authSlice.js';
import StoryViewer from './StoryViewer.jsx';
import { useLocation, useNavigate } from 'react-router-dom';

const Stories = () => {
  const { user, Stories = [],myStories=[] } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const location = useLocation()
  const navigate = useNavigate()

  const [open, setOpen] = useState(false);
  const [preview, setPreview] = useState(null);
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [selectedStory, setSelectedStory] = useState(null);
  const [showViewer, setShowViewer] = useState(false);
  const fileInputRef = useRef();
// const hasStory = myStories?.length > 0;
  const HideStory = location.pathname === "/";
 useEffect(() => {
    const HideStory = location.pathname === "/";
  }, [navigate]);

  const hasStory = user?.stories?.length > 0;
  useEffect(() => {
    const getStories = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/v1/story/allstories`,
          { withCredentials: true }
        );
        if (res.data.success) {
          dispatch(setStories(res.data.stories));
        }
      } catch (error) {
        toast.error(error?.response?.data?.message || "Couldn't fetch stories");
      }
    };
    getStories();
  }, [dispatch]);

    useEffect(() => {
    const getMyStories = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/v1/story/myStory`,
          { withCredentials: true }
        );
        if (res.data.success) {
          dispatch(setmyStories(res.data.data));
          console.log(res.data.data);
          
        }
      } catch (error) {
        toast.error(error?.response?.data?.message || "Couldn't fetch stories");
      }
    };
    getMyStories();
  }, [dispatch]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleUpload = async () => {
    if (!image) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('image', image);

    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/v1/story/addstory`,
        formData,
        {
          withCredentials: true,
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      );
      toast.success('Story uploaded successfully!');
      setOpen(false);
      setPreview(null);
      setImage(null);

      // Refetch stories after upload
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/v1/story/allstories`,
        { withCredentials: true }
      );
      if (res.data.success) {
        dispatch(setStories(res.data.stories));
      }
    } catch (error) {
      toast.error('Upload failed. Please try again.');
      console.error('Upload error:', error);
    } finally {
      setUploading(false);
    }
  };

const openUserStory = () => {
  if (myStories?.length > 0) {
    setSelectedStory(myStories[0]);
    setShowViewer(true);
  }
};


  const openOtherStory = (story) => {
    setSelectedStory(story);
    setShowViewer(true);
  };

  return (
    <div className={`w-full md:pl-[17%] px-4 py-2 bg-white rounded-xl shadow-sm mb-4 ${HideStory ? 'block':'hidden'}`}>
      <div className="md:flex hidden items-center justify-between mb-3">
        <h2 className="text-lg font-semibold flex items-center gap-1">
          <ScrollText className="w-5 h-5 text-pink-500" />
          Stories
        </h2>
      </div>

      <div className="flex items-center space-x-4 overflow-x-auto scrollbar-hide">
        {/* Your Story */}
        {hasStory ? (
          <div
            onClick={openUserStory}
            className="relative cursor-pointer group flex flex-col items-center"
          >
            <Avatar.Root className="w-14 h-14 relative">
              <Avatar.Image
                src={user?.profilePicture}
                alt={user?.username}
                className="w-full h-full rounded-full object-cover border-2 border-green-500 p-0.5 group-hover:scale-105 transition-transform"
              />
              <Avatar.Fallback className="w-full h-full bg-gray-200 rounded-full flex items-center justify-center text-sm">
                {user?.username?.[0]?.toUpperCase()}
              </Avatar.Fallback>
            </Avatar.Root>
            <span className="text-xs mt-1">Your Story</span>
            {/* <div onClick={handleUpload} className="absolute bottom-5 right-0 w-5 h-5 z-10 hover:scale-110 bg-pink-500 rounded-full flex items-center justify-center border-2 border-white">
                  <PlusCircle  className="w-4 h-4 text-white" />
                </div> */}
          </div>
        ) : (
          <Dialog.Root open={open} onOpenChange={setOpen}>
            <Dialog.Trigger asChild>
              <div className="relative cursor-pointer group flex flex-col items-center">
                <Avatar.Root onClick={openUserStory} className="w-14 h-14 relative">
                  <Avatar.Image
                    src={user?.profilePicture}
                    alt={user?.username}
                    className="w-full h-full rounded-full object-cover border-2 border-pink-500 p-0.5 group-hover:scale-105 transition-transform"
                  />
                  <Avatar.Fallback className="w-full h-full bg-gray-200 rounded-full flex items-center justify-center text-sm">
                    {user?.username?.[0]?.toUpperCase()}
                  </Avatar.Fallback>
                </Avatar.Root>
                <div className="absolute bottom-5 right-0 w-5 h-5 bg-pink-500 rounded-full flex items-center justify-center border-2 border-white">
                  <PlusCircle className="w-4 h-4 text-white" />
                </div>
                <span className="text-xs mt-1">Your Story</span>
              </div>
            </Dialog.Trigger>

            <Dialog.Portal>
              <Dialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40" />
              <Dialog.Content className="fixed z-50 top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-xl w-[90%] max-w-sm shadow-2xl transition-all duration-300">
                <Dialog.Title className="text-lg font-bold mb-3 text-gray-700">
                  Upload a Story
                </Dialog.Title>
                {preview ? (
                  <img
                    src={preview}
                    alt="preview"
                    className="w-full h-48 object-cover rounded-md mb-3 shadow"
                  />
                ) : (
                  <div className="w-full h-48 flex items-center justify-center border-2 border-dashed rounded-md mb-3 text-gray-400 text-sm">
                    No image selected
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  ref={fileInputRef}
                  onChange={handleFileChange}
                />
                <button
                  onClick={() => fileInputRef.current.click()}
                  className="w-full rounded-full py-2 mb-2 bg-blue-500 text-white rounded-md hover:bg-pink-600 transition font-medium"
                  disabled={uploading}
                >
                  Choose Image
                </button>
                <button
                  onClick={handleUpload}
                  disabled={!image || uploading}
                  className={`w-full py-2 rounded-md font-medium transition ${
                    image && !uploading
                      ? 'bg-green-500 hover:bg-green-600 text-white'
                      : 'bg-green-300 text-white cursor-not-allowed'
                  }`}
                >
                  {uploading ? 'Uploading...' : 'Upload'}
                </button>
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
        )}

        {/* Story Viewer */}
        {showViewer && selectedStory && (
          <StoryViewer
            story={selectedStory}
            open={showViewer}
            setOpen={setShowViewer}
            onClose={() => {
              setShowViewer(false);
              setSelectedStory(null);
            }}
          />
        )}

        {/* Stories of Other Users */}
        {Stories.map((story) => (
          <div
            key={story._id}
            onClick={() => openOtherStory(story)}
            className="flex flex-col items-center cursor-pointer"
          >
            <Avatar.Root className="w-14 h-14 relative">
              <Avatar.Image
                src={story.author?.ProfilePicture}
                alt={story.author?.username}
                className="w-full h-full rounded-full object-cover border-2 border-pink-500 p-0.5 hover:scale-105 transition-transform"
              />
              <Avatar.Fallback className="w-full h-full bg-gray-200 rounded-full flex items-center justify-center text-sm">
                {story.author?.username?.[0]?.toUpperCase()}
              </Avatar.Fallback>
            </Avatar.Root>
            <span className="text-xs mt-1 truncate max-w-[56px]">
              {story.author?.username}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Stories;
