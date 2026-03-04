import React, { useEffect, useState } from "react";
import { Label } from "@radix-ui/react-label";
import { Button } from "./ui/button";
import axios from "axios";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";
import { Loader2, UserPlus } from "lucide-react";
import { useSelector } from "react-redux";
import { FaHeart } from "react-icons/fa";
import Logo from "./Logo";

const Signup = () => {
  const navigate = useNavigate();
  const { user } = useSelector((store) => store.auth);
  const [input, setinput] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [loading, setloading] = useState(false);

  const changeHandler = (e) => {
    setinput({ ...input, [e.target.name]: e.target.value });
  };

  const SignupHandler = async (e) => {
    e.preventDefault();
    try {
      setloading(true);
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/v1/user/register`,
        input,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        setinput({ username: "", email: "", password: "" });
        navigate("/login");
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setloading(false);
    }
  };

  useEffect(() => {
    if (user) navigate("/");
  }, [user, navigate]);

  return (
    <div className="relative flex items-center justify-center min-h-screen w-full bg-[#050505] overflow-hidden text-white px-4">
      {/* Background Glows (Inverse of Login for visual variety) */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/10 blur-[120px]" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-red-500/10 blur-[120px]" />

      <div className="z-10 w-full max-w-md">
        <div className="backdrop-blur-2xl bg-white/[0.03] border border-white/10 p-8 md:p-10 rounded-[2.5rem] shadow-2xl transition-all duration-500 hover:border-white/20">
          
          {/* Header */}
          <div className="flex flex-col items-center mb-8">
            {/* <div className="bg-gradient-to-tr from-blue-600 to-indigo-400 p-3 rounded-2xl mb-4 shadow-lg shadow-blue-500/20">
               <UserPlus className="text-white text-xl" size={24} />
            </div> */}
            <Logo/>
            <p className="text-gray-400 text-sm mt-3 text-center font-medium max-w-[250px]">
              Join the community and start sharing your moments.
            </p>
          </div>

          <form onSubmit={SignupHandler} className="flex flex-col gap-5">
            {/* Username */}
            <div className="space-y-1.5">
              <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 ml-1">
                Username
              </Label>
              <input
                type="text"
                name="username"
                placeholder="cool_human_01"
                value={input.username}
                onChange={changeHandler}
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-4 outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-300 placeholder:text-gray-700"
                required
              />
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 ml-1">
                Email Address
              </Label>
              <input
                type="email"
                name="email"
                placeholder="hello@Frame.com"
                value={input.email}
                onChange={changeHandler}
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-4 outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-300 placeholder:text-gray-700"
                required
              />
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 ml-1">
                Password
              </Label>
              <input
                type="password"
                name="password"
                placeholder="Create a strong password"
                value={input.password}
                onChange={changeHandler}
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-4 outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-300 placeholder:text-gray-700"
                required
              />
            </div>

            {/* Signup Button */}
            <Button 
              type="submit" 
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:opacity-90 h-14 rounded-2xl font-bold text-lg mt-2 shadow-lg shadow-blue-500/20 transition-transform active:scale-95"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="animate-spin" size={20} />
                  Creating Account...
                </div>
              ) : (
                "Get Started"
              )}
            </Button>

            <p className="text-center text-sm text-gray-500 mt-2">
              Already have an account?{" "}
              <Link to="/login" className="text-blue-400 font-bold hover:underline decoration-2 underline-offset-4">
                Login
              </Link>
            </p>
          </form>
        </div>
        
        <div className="mt-8 flex justify-center gap-6 opacity-30">
            <span className="text-[10px] font-medium cursor-pointer">Privacy</span>
            <span className="text-[10px] font-medium cursor-pointer">Terms</span>
            <span className="text-[10px] font-medium cursor-pointer">Cookies</span>
        </div>
      </div>
    </div>
  );
};

export default Signup;