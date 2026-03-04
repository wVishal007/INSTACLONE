import React, { useState } from 'react';
import CreatePostDialog from './CreatePostDialog';
import { Dialog, DialogContent, DialogHeader } from './ui/dialog';
import { Button } from './ui/button';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import axios from 'axios';
import { setStories, setmyStories } from '../redux/authSlice';
import { LayoutGrid, History, X, UploadCloud, Loader2 } from 'lucide-react';

const CreatePostVsStory = ({ open, setOpen }) => {
  const [isPostOpen, setIsPostOpen] = useState(false);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const { myStories } = useSelector(store => store.auth);
  const dispatch = useDispatch();

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
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
        {
          withCredentials: true,
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      );

      toast.success('Story live for 24 hours!');
      dispatch(setmyStories([res.data.story, ...myStories]));
      setPreview(null);
      setImage(null);
      setOpen(false); // Close the choice dialog

      // Refresh all stories
      const allRes = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/story/allstories`, { withCredentials: true });
      if (allRes.data.success) dispatch(setStories(allRes.data.stories));
      
    } catch (error) {
      toast.error('Story upload failed.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-[#0a0a0a]/95 backdrop-blur-2xl border-white/10 text-white max-w-lg p-0 overflow-hidden rounded-3xl">
          <DialogHeader className="p-6 border-b border-white/5">
            <h2 className="text-center font-black uppercase tracking-[0.2em] text-sm">Create Content</h2>
          </DialogHeader>

          <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* OPTION 1: POST */}
            <div 
              onClick={() => setIsPostOpen(true)}
              className="group relative flex flex-col items-center justify-center p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-red-500/50 hover:bg-white/10 transition-all cursor-pointer"
            >
              <div className="p-4 rounded-full bg-red-500/10 text-red-500 mb-4 group-hover:scale-110 transition-transform">
                <LayoutGrid size={32} />
              </div>
              <h3 className="font-bold text-lg">Post</h3>
              <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest mt-1 text-center">Permanent Gallery</p>
            </div>

            {/* OPTION 2: STORY */}
            <div 
              onClick={() => document.getElementById('storyInput').click()}
              className="group relative flex flex-col items-center justify-center p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-blue-500/50 hover:bg-white/10 transition-all cursor-pointer"
            >
              <div className="p-4 rounded-full bg-blue-500/10 text-blue-500 mb-4 group-hover:scale-110 transition-transform">
                <History size={32} />
              </div>
              <h3 className="font-bold text-lg">Story</h3>
              <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest mt-1 text-center">Expires in 24h</p>
              <input id="storyInput" type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
            </div>
          </div>

          {/* STORY PREVIEW OVERLAY */}
          {preview && (
            <div className="absolute inset-0 z-50 bg-[#050505] p-6 flex flex-col">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-black uppercase tracking-widest text-xs">Story Preview</h3>
                <button onClick={() => setPreview(null)} className="p-2 hover:bg-white/10 rounded-full">
                  <X size={20} />
                </button>
              </div>
              
              <div className="flex-1 w-full rounded-2xl overflow-hidden border border-white/10 bg-black">
                <img src={preview} alt="preview" className="w-full h-full object-contain" />
              </div>

              <div className="pt-6 flex gap-3">
                <Button 
                  disabled={uploading} 
                  onClick={handleUpload} 
                  className="flex-1 bg-blue-600 hover:bg-blue-500 h-12 rounded-xl font-bold uppercase tracking-widest"
                >
                  {uploading ? <Loader2 className="animate-spin mr-2" /> : <UploadCloud size={18} className="mr-2" />}
                  {uploading ? 'Sharing...' : 'Share Story'}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setPreview(null)} 
                  className="bg-transparent border-white/10 hover:bg-white/5 h-12 rounded-xl"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Actual Post Dialog */}
      <CreatePostDialog open={isPostOpen} setOpen={(val) => {
        setIsPostOpen(val);
        if(!val) setOpen(false); // Close parent if child closes
      }} />
    </>
  );
};

export default CreatePostVsStory;