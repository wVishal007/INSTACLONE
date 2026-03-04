import React, { useEffect, useState } from "react";
import { Label } from "@radix-ui/react-label";
import { Button } from "./ui/button";
import { Input } from "./ui/input"; // Using a styled input component if available
import axios from "axios";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";
import { Loader2, Sparkles } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { setAuthUser } from "../redux/authSlice";
import { FaHeart } from "react-icons/fa";
import Logo from "./Logo";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((store) => store.auth);
  const [input, setinput] = useState({
    email: "",
    password: "",
  });

  const [loading, setloading] = useState(false);

  const changeHandler = (e) => {
    setinput({ ...input, [e.target.name]: e.target.value });
  };

  const loginHandler = async (e) => {
    e.preventDefault();
    try {
      setloading(true);
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/v1/user/login`,
        input,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        dispatch(setAuthUser(res.data.User));
        setinput({ email: "", password: "" });
        navigate("/");
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setloading(false);
    }
  };

  useEffect(() => {
    if (user) navigate("/");
  }, [user, navigate]);

  return (
    <div className="relative flex items-center justify-center min-h-screen w-full bg-[#050505] overflow-hidden text-white">
      {/* Background Ambient Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-red-500/10 blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/10 blur-[120px]" />

      <div className="z-10 w-full max-w-md px-6">
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 p-10 rounded-[2.5rem] shadow-2xl">
          {/* Header Section */}
          <div className="flex flex-col items-center mb-10">
           <Logo/>
            <p className="text-gray-400 text-sm mt-2 text-center font-medium">
              Welcome back. Your world is waiting.
            </p>
          </div>

          <form onSubmit={loginHandler} className="flex flex-col gap-6">
            {/* Email Field */}
            <div className="space-y-2">
              <Label className="text-xs font-semibold uppercase tracking-widest text-gray-500 ml-1">
                Email Address
              </Label>
              <input
                type="email"
                name="email"
                placeholder="name@example.com"
                value={input.email}
                onChange={changeHandler}
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-4 outline-none focus:ring-2 focus:ring-red-500/50 transition-all duration-300 placeholder:text-gray-600"
                required
              />
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <Label className="text-xs font-semibold uppercase tracking-widest text-gray-500">
                  Password
                </Label>
                <span className="text-[10px] text-red-400 cursor-pointer hover:underline">Forgot?</span>
              </div>
              <input
                type="password"
                name="password"
                placeholder="••••••••"
                value={input.password}
                onChange={changeHandler}
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-4 outline-none focus:ring-2 focus:ring-red-500/50 transition-all duration-300 placeholder:text-gray-600"
                required
              />
            </div>

            {/* Login Button */}
            <Button 
              type="submit" 
              disabled={loading}
              className="w-full bg-white text-black hover:bg-gray-200 h-12 rounded-2xl font-bold text-base transition-transform active:scale-95 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Syncing...
                </>
              ) : (
                "Sign In"
              )}
            </Button>

            {/* Footer */}
            <p className="text-center text-sm text-gray-500 mt-2">
              New here?{" "}
              <Link to="/signup" className="text-white font-bold hover:text-red-400 transition-colors">
                Create account
              </Link>
            </p>
          </form>
        </div>
        
        <p className="mt-8 text-center text-[10px] text-gray-600 tracking-[0.2em] uppercase">
          &copy; 2026 FRAME Digital Experience
        </p>
      </div>
    </div>
  );
};

export default Login;