import { Label } from "@radix-ui/react-label";
import { Button } from "./ui/button";
import React, { useEffect } from "react";
import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useSelector } from "react-redux";
import { FaHeart } from "react-icons/fa";

const Signup = () => {
  const navigate = useNavigate();
  const {user} = useSelector(store=>store.auth)
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
    console.log(input);
    try {
      setloading(true);
      const res = await axios.post(
        `${process.env.URL}.com/api/v1/user/register`,
        input,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        setinput({
          username: "",
          email: "",
          password: "",
        });
        navigate('/login');
        toast.success(res.data.message);
        toast.error(response.data.message);
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
        onSubmit={SignupHandler}
        className="shadow-lg flex flex-col gap-5 p-8 justify-center"
      >
        <div className="flex flex-col gap-1 font-sans items-center justify-center">
          {" "}
          {/* <h1 className="text-center font-bold text-xl">Instagram</h1> */}
          <h1 className="font-bold font-mono text-4xl flex gap-1 my-1">FUN<FaHeart className="text-red-500"/> APP</h1>
          <p className="text-sm text-center">
            Sign up to connect to people and see what they share
          </p>
        </div>
        <div className="flex flex-col justify-center">
          <Label className="font-bold py-1 ">Username</Label>
          <input
            type="text"
            name="username"
            onChange={changeHandler}
            className=" border-1 rounded-2xl py-2 shadow-lg focus-visible:ring-transparent px-3"
            value={input.username}
          />
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
        {loading?(<Button><Loader2 className="mr-2 h- w-4"/>Please wait...</Button>):(<Button type="submit">Signup</Button>)}
        
        <span className="text-center">Already have an account? <Link to={'/login'} className="text-blue-600">Login</Link></span>
      </form>
    </div>
  );
};

export default Signup;
