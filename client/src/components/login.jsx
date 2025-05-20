import { Label } from "@radix-ui/react-label";
import { Button } from "./ui/button";
import React, { useEffect } from "react";
import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { setAuthUser } from "../redux/authSlice";
import { FaHeart } from "react-icons/fa";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {user} = useSelector(store=>store.auth)
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
        "https://instaclone-sje7.onrender.com/api/v1/user/login",
        input,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      //  toast.error(res.data.message);
      if (res.data.success) {
        console.log(res.data.User)
        dispatch(setAuthUser(res.data.User));
        setinput({
          email: "",
          password: "",
        });
        navigate('/');
        toast.success(res.data.message);
        toast.error(res.data.message);
      }

    } catch (error) {
      console.log(error);
    } finally {
      setloading(false);
    }
  };

  useEffect(()=>{
if(user){
  navigate('/')
}
  },[])
  return (
    <div className="flex items-center h-screen w-screen justify-center">
      <form
        onSubmit={loginHandler}
        className="shadow-lg flex flex-col gap-5 p-8 justify-center "
      >
        <div className="flex flex-col gap-1 font-sans items-center justify-center">
          {" "}
          {/* <h1 className="text-center font-bold text-xl">Instagram</h1> */}
          <h1 className="font-bold font-mono text-4xl flex gap-1 my-1">FUN<FaHeart className="text-red-500"/> APP</h1>
          <p className="text-sm text-center">
        Login to connect to people and see what they share
          </p>
        </div>
        <div className="flex flex-col justify-center">
          <Label className="font-bold py-1">Email</Label>
          <input
            type="email"
            name="email"
            value={input.email}
            onChange={changeHandler}
            className=" border-1 rounded-2xl py-2 shadow-lg focus-visible:ring-transparent px-3"
          />
        </div>
        <div className="flex flex-col justify-center">
          <Label className="font-bold py-1 ">Password</Label>
          <input
            type="password"
            name="password"
            value={input.password}
            onChange={changeHandler}
            className=" border-1 rounded-2xl py-2 shadow-lg focus-visible:ring-transparent px-3"
          />
        </div>
        {/* <Button type="submit">Login</Button> */}
        {loading?(<Button><Loader2 className="mr-2 h- w-4"/>Please wait...</Button>):(<Button type="submit">Login</Button>)}
        <span className="text-center">Don't have an account? <Link to={'/signup'} className="text-blue-600">Signup</Link></span>
      </form>
    </div>
  );
};

export default Login;