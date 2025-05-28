import React, { useState } from 'react';
import CreatePostDialog from './CreatePostDialog';
import { Dialog, DialogContent, DialogHeader } from './ui/dialog';
import { Button } from './ui/button';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import axios from 'axios';
import { setStories, setmyStories } from '../redux/authSlice';

const CreatePostVsStory = ({open,setOpen}) => {
  const [mainDialogOpen, setMainDialogOpen] = useState(false);
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

      toast.success('Story uploaded successfully!');
      dispatch(setmyStories([res.data.story, ...myStories]));
      setImage(null);
      setPreview(null);

      const allRes = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/v1/story/allstories`,
        { withCredentials: true }
      );
      if (allRes.data.success) {
        dispatch(setStories(allRes.data.stories));
      }
    } catch (error) {
      toast.error('Upload failed. Please try again.');
      console.error('Upload error:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <Button onClick={() => setMainDialogOpen(true)}>Create</Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-white max-w-xl">
          <DialogHeader className="text-center font-bold text-lg">
            Create a Post or Story
          </DialogHeader>

          <div className="flex flex-col gap-6 py-4">
            {/* Create Post Section */}
            <div className="flex flex-col gap-2">
              <Button onClick={() => setIsPostOpen(true)} className="bg-blue-600 hover:bg-blue-700">
                Create Post
              </Button>
              <CreatePostDialog open={isPostOpen} setOpen={setIsPostOpen} />
            </div>

            {/* Create Story Section */}
            <div className="flex flex-col gap-3">
              <Button
                onClick={() => document.getElementById('storyInput').click()}
                className="bg-green-600 hover:bg-green-700"
              >
                Upload Story
              </Button>
              <input
                id="storyInput"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />

              {preview && (
                <div className="w-full h-60 flex items-center justify-center">
                  <img
                    src={preview}
                    alt="preview"
                    className="rounded-md h-full object-cover"
                  />
                </div>
              )}

              {preview && (
                <div className="flex justify-center gap-3">
                  <Button
                    disabled={uploading}
                    onClick={handleUpload}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {uploading ? 'Uploading...' : 'Upload Story'}
                  </Button>
                  <Button variant="outline" onClick={() => setPreview(null)}>
                    Cancel
                  </Button>
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CreatePostVsStory;
