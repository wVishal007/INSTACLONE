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
import { Loader2 } from "lucide-react";

const EditProfile = () => {
  const { user } = useSelector((store) => store.auth);
  const imageRef = useRef();
  const [loading, setloading] = useState(false);
  const [input, setinput] = useState({
    ProfilePicture: user?.profilePicture,
    bio: user?.bio ,
    gender: user?.gender ,
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
    }
  };

  const EditProfileHandler = async () => {
    try {
      const formData = new FormData();
      formData.append("bio", input.bio);
      formData.append("gender", input.gender);
      if (input.ProfilePicture) {
        formData.append("ProfilePicture", input.ProfilePicture);
      }
      setloading(true);
      const res = await axios.post(
        "http://localhost:3000/api/v1/user/profile/edit",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        setloading(false);
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
      setloading(false);
      toast.error(error.response.data.message);
    }
  };

  return (
    <div className="flex max-w-2xl mx-auto">
      <section className="flex flex-col gap-6 w-full my-8">
        <h1 className="font-bold text-xl">Edit Profile</h1>
        <div className="bg-gray-100 p-4 gap-5 items-center justify-between flex rounded-xl">
          <div className="flex gap-3 items-center">
            <Avatar>
              <AvatarImage
                className="w-10 h-10 rounded-full object-cover"
                src={user?.profilePicture}
                alt={user?.username}
              />
              <AvatarFallback>{user.username?.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <h1 className="text-sm font-bold">{user.username}</h1>

              <span className=" text-gray-500 ">{user?.bio}</span>
            </div>
          </div>
          <input
            ref={imageRef}
            onChange={fileChangeHandler}
            type="file"
            className="hidden"
          />
          <Button
            onClick={() => imageRef.current.click()}
            className=" bg-blue-600 hover:bg-blue-800 font-semibold hover:scale-98 cursor-pointer"
          >
            Change Photo
          </Button>
        </div>
        <div>
          <h1 className="font-semibold my-2 text-xl">Bio</h1>
          <Textarea
            value={input.bio}
            onChange={(e) => setinput({ ...input, bio: e.target.value })}
            name="bio"
            placeholder="enter your bio"
            className="focus-visible:ring-transparent"
          />
        </div>
        <div>
          <h1 className="font-semibold my-2 text-xl">Gender</h1>
          <Select defaultValue={input.bio} onValueChange={selectChangeHandler}>
            <SelectTrigger className="w-[180px] focus-visible:ring-transparent">
              <SelectValue placeholder="Gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex justify-end">
          {loading ? (
            <Button className=" bg-blue-600 hover:bg-blue-800 font-semibold hover:scale-98 cursor-pointer">
              please wait...
              <Loader2 className="animate-spin mr-2 h-4 w-4" />
            </Button>
          ) : (
            <Button
              onClick={EditProfileHandler}
              className=" bg-blue-600 hover:bg-blue-800 font-semibold hover:scale-98 cursor-pointer"
            >
              Submit
            </Button>
          )}
        </div>
      </section>
    </div>
  );
};

export default EditProfile;
