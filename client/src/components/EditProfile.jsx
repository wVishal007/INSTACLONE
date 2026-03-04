import React, { useRef, useState } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { setAuthUser } from "../redux/authSlice";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import axios from "axios";
import { Loader2, Camera } from "lucide-react";

const EditProfile = () => {
  const { user } = useSelector((store) => store.auth);
  const imageRef = useRef();
  const [loading, setloading] = useState(false);
  const [input, setinput] = useState({
    ProfilePicture: user?.profilePicture,
    bio: user?.bio || "",
    gender: user?.gender || "",
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const selectChangeHandler = (value) => {
    setinput({ ...input, gender: value });
  };

  const fileChangeHandler = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setinput({ ...input, ProfilePicture: file });
      // Optional: Add local preview logic here if desired
    }
  };

  const EditProfileHandler = async () => {
    try {
      const formData = new FormData();
      formData.append("bio", input.bio);
      formData.append("gender", input.gender);
      if (input.ProfilePicture instanceof File) {
        formData.append("ProfilePicture", input.ProfilePicture);
      }
      
      setloading(true);
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/v1/user/profile/edit`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        const updatedUserData = {
          ...user,
          bio: res.data?.User.bio,
          gender: res.data?.User.gender,
          profilePicture: res.data?.User?.ProfilePicture,
        };
        dispatch(setAuthUser(updatedUserData));
        toast.success(res.data.message);
        navigate(`/profile/${user?._id}`);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Update failed");
    } finally {
      setloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white flex justify-center md:ml-[18%] lg:ml-[16%]">
      <section className="flex flex-col gap-8 w-full max-w-2xl my-12 px-6">
        <div>
          <h1 className="font-black text-3xl tracking-tighter">Edit Profile</h1>
          <p className="text-gray-500 text-sm mt-1">Manage your public identity on FRAME.</p>
        </div>

        {/* Profile Photo Section */}
        <div className="bg-white/5 border border-white/10 p-6 flex flex-col sm:flex-row gap-6 items-center justify-between rounded-3xl backdrop-blur-sm">
          <div className="flex gap-4 items-center">
            <div className="relative group cursor-pointer" onClick={() => imageRef.current.click()}>
              <Avatar className="w-20 h-20 border-2 border-red-500/20">
                <AvatarImage
                  className="object-cover"
                  src={input.ProfilePicture instanceof File ? URL.createObjectURL(input.ProfilePicture) : user?.profilePicture}
                  alt={user?.username}
                />
                <AvatarFallback className="bg-white/10 text-xl">{user?.username?.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera size={20} className="text-white" />
              </div>
            </div>
            <div className="flex flex-col">
              <h1 className="text-lg font-bold tracking-tight">{user?.username}</h1>
              <span className="text-xs text-gray-500 font-medium uppercase tracking-widest">Active Creator</span>
            </div>
          </div>
          
          <input ref={imageRef} onChange={fileChangeHandler} type="file" className="hidden" accept="image/*" />
          <Button
            onClick={() => imageRef.current.click()}
            variant="secondary"
            className="bg-white/10 hover:bg-white/20 text-white rounded-xl border border-white/10"
          >
            Change Photo
          </Button>
        </div>

        {/* Bio Section */}
        <div className="space-y-3">
          <label className="text-sm font-black uppercase tracking-widest text-gray-400">Bio</label>
          <Textarea
            value={input.bio}
            onChange={(e) => setinput({ ...input, bio: e.target.value })}
            placeholder="Tell the world your story..."
            className="bg-white/5 border-white/10 focus-visible:ring-red-500/50 rounded-2xl min-h-[120px] text-white"
          />
        </div>

        {/* Gender Section */}
        <div className="space-y-3">
          <label className="text-sm font-black uppercase tracking-widest text-gray-400">Gender</label>
          <Select defaultValue={user?.gender} onValueChange={selectChangeHandler}>
            <SelectTrigger className="w-full sm:w-[200px] bg-white/5 border-white/10 focus:ring-red-500/50 rounded-xl text-white">
              <SelectValue placeholder="Select Gender" />
            </SelectTrigger>
            <SelectContent className="bg-[#0a0a0a] border-white/10 text-white">
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
              <SelectItem value="prefer_not_to_say">Prefer not to say</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Submit Actions */}
        <div className="flex justify-end gap-4 pt-4">
          <Button 
            variant="ghost" 
            onClick={() => navigate(`/profile/${user?._id}`)}
            className="hover:bg-white/5 text-gray-400"
          >
            Cancel
          </Button>
          <Button
            onClick={EditProfileHandler}
            disabled={loading}
            className="bg-red-600 hover:bg-red-500 text-white font-bold px-10 h-12 rounded-2xl shadow-lg shadow-red-900/20 transition-all"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin mr-2 h-4 w-4" />
                Updating...
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </div>
      </section>
    </div>
  );
};

export default EditProfile;