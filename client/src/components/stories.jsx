import React, { useRef, useState, useEffect } from 'react';
import * as Avatar from '@radix-ui/react-avatar';
import * as Dialog from '@radix-ui/react-dialog';
import { ScrollText, Plus, Sparkles, X } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { toast } from 'sonner';
import { setmyStories, setStories } from '../redux/authSlice.js';
import StoryViewer from './StoryViewer.jsx';
import { useLocation, useNavigate } from 'react-router-dom';

const Stories = () => {
  const { user, Stories = [], myStories = [], SuggestedUsers = [] } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [preview, setPreview] = useState(null);
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [selectedStory, setSelectedStory] = useState(null);
  const [showViewer, setShowViewer] = useState(false);
  const fileInputRef = useRef();

  const isHomePage = location.pathname === "/";

  // Unified Story Fetching Logic
  useEffect(() => {
    const fetchAllStories = async () => {
      try {
        const [allRes, myRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_API_URL}/api/v1/story/allstories`, { withCredentials: true }),
          axios.get(`${import.meta.env.VITE_API_URL}/api/v1/story/myStory`, { withCredentials: true })
        ]);
        
        if (allRes.data.success) dispatch(setStories(allRes.data.stories));
        if (myRes.data.success) dispatch(setmyStories(myRes.data.data));
      } catch (error) {
        console.error("Story fetch error", error);
      }
    };
    if(isHomePage) fetchAllStories();
  }, [dispatch, isHomePage]);

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
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/v1/story/addstory`,
        formData,
        { withCredentials: true, headers: { 'Content-Type': 'multipart/form-data' } }
      );
      if (res.data.success) {
        toast.success('Story live!');
        setOpen(false);
        setPreview(null);
        setImage(null);
        // Refresh local state
        dispatch(setmyStories([res.data.story, ...myStories]));
      }
    } catch (error) {
      toast.error('Upload failed');
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

  return (
    <div className={`w-full md:pl-[18%] lg:pl-[16%] px-4 pt-6 pb-2 bg-transparent transition-all duration-500 ${isHomePage ? 'block' : 'hidden'}`}>
      
      {/* Header Label */}
      <div className="flex items-center gap-2 mb-4 px-2">
        <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
        <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">
          Recent Stories
        </h2>
      </div>

      <div className="flex items-center space-x-5 overflow-x-auto scrollbar-hide pb-4">
        
        {/* CREATE / VIEW MY STORY */}
        <div className="flex flex-col items-center flex-shrink-0 group">
          <div className="relative p-[3px] rounded-full bg-gradient-to-tr from-gray-700 to-gray-800 transition-transform duration-300 active:scale-90">
            <Avatar.Root 
              onClick={myStories.length > 0 ? openUserStory : () => setOpen(true)}
              className="w-16 h-16 md:w-20 md:h-20 cursor-pointer block"
            >
              <Avatar.Image
                src={user?.profilePicture}
                className="w-full h-full rounded-full object-cover border-[3px] border-[#050505]"
              />
              <Avatar.Fallback className="w-full h-full bg-white/10 rounded-full flex items-center justify-center text-xl font-bold">
                {user?.username?.[0]}
              </Avatar.Fallback>
            </Avatar.Root>
            
            {myStories.length === 0 && (
              <div 
                onClick={() => setOpen(true)}
                className="absolute bottom-1 right-1 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center border-[3px] border-[#050505] group-hover:bg-blue-500 transition-colors cursor-pointer"
              >
                <Plus size={14} className="text-white stroke-[3px]" />
              </div>
            )}
          </div>
          <span className="text-[10px] font-bold text-gray-400 mt-2 tracking-tight">Your Story</span>
        </div>

        {/* OTHER STORIES */}
        {Stories.filter(s => s.author?._id !== user?._id).map((story) => (
          <div
            key={story._id}
            onClick={() => { setSelectedStory(story); setShowViewer(true); }}
            className="flex flex-col items-center flex-shrink-0 animate-in fade-in zoom-in duration-300"
          >
            <div className="p-[3px] rounded-full bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600">
              <Avatar.Root className="w-16 h-16 md:w-20 md:h-20 border-[3px] border-[#050505] rounded-full overflow-hidden block">
                <Avatar.Image
                  src={story.author?.ProfilePicture}
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                />
              </Avatar.Root>
            </div>
            <span className="text-[10px] font-bold text-gray-200 mt-2 truncate max-w-[65px]">
              {story.author?.username}
            </span>
          </div>
        ))}

        {/* SUGGESTIONS (IF NO STORIES) */}
        {Stories.length <= 1 && SuggestedUsers.map((item) => (
          <div 
            key={item?._id} 
            onClick={() => navigate(`profile/${item?._id}`)}
            className="flex flex-col items-center flex-shrink-0 opacity-60 hover:opacity-100 transition-opacity"
          >
            <div className="p-[2px] rounded-full border border-dashed border-gray-600">
                <Avatar.Root className="w-16 h-16 md:w-20 md:h-20 block border-[3px] border-transparent">
                  <Avatar.Image src={item?.ProfilePicture} className="w-full h-full rounded-full object-cover grayscale" />
                  <Avatar.Fallback className="w-full h-full bg-gray-800 rounded-full flex items-center justify-center" />
                </Avatar.Root>
            </div>
            <span className="text-[10px] font-medium text-gray-500 mt-2 truncate max-w-[65px]">{item.username}</span>
          </div>
        ))}
      </div>

      {/* UPLOAD DIALOG */}
      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100]" />
          <Dialog.Content className="fixed z-[101] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#121212] border border-white/10 p-8 rounded-[2.5rem] w-[95%] max-w-sm shadow-2xl">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-blue-600/20 rounded-2xl flex items-center justify-center mb-4">
                 <Sparkles className="text-blue-500" />
              </div>
              <Dialog.Title className="text-xl font-black text-white tracking-tight mb-1">Share a Moment</Dialog.Title>
              <Dialog.Description className="text-gray-500 text-sm mb-6">This story will disappear in 24 hours.</Dialog.Description>

              <div className="relative w-full aspect-[9/12] bg-white/5 rounded-3xl border border-dashed border-white/10 overflow-hidden mb-6 flex items-center justify-center">
                {preview ? (
                  <>
                    <img src={preview} className="w-full h-full object-cover" />
                    <button onClick={() => setPreview(null)} className="absolute top-4 right-4 p-2 bg-black/50 rounded-full text-white"><X size={16}/></button>
                  </>
                ) : (
                  <button onClick={() => fileInputRef.current.click()} className="flex flex-col items-center gap-2 text-gray-500 hover:text-white transition-colors">
                    <Plus size={32} />
                    <span className="text-xs font-bold uppercase tracking-widest">Select Media</span>
                  </button>
                )}
              </div>

              <input type="file" accept="image/*" hidden ref={fileInputRef} onChange={handleFileChange} />
              
              <div className="w-full flex flex-col gap-3">
                <button
                  onClick={handleUpload}
                  disabled={!image || uploading}
                  className="w-full py-4 bg-white text-black rounded-2xl font-bold hover:bg-gray-200 disabled:opacity-50 transition-all"
                >
                  {uploading ? 'Sharing...' : 'Post Story'}
                </button>
                <button onClick={() => setOpen(false)} className="text-gray-500 text-xs font-bold uppercase tracking-widest pt-2">Cancel</button>
              </div>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {/* VIEWER PORTAL */}
      {showViewer && selectedStory && (
        <StoryViewer
          story={selectedStory}
          open={showViewer}
          setOpen={setShowViewer}
          onClose={() => { setShowViewer(false); setSelectedStory(null); }}
        />
      )}
    </div>
  );
};

export default Stories;