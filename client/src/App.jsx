import { useEffect, useRef } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Signup from "./components/signup";
import Login from "./components/login";
import Home from "./components/home";
import MainLayout from "./components/MainLayout";
import Profile from "./components/profile";
import EditProfile from "./components/EditProfile";
import ProtectedRoutes from "./components/ProtectedRoutes";
import ChatWindow from "./components/ChatWindow";
import NotificationPage from "./components/NotificationPage";
import Search from "./components/Search";

import { useDispatch, useSelector } from "react-redux";
import { setAuthUser } from './redux/authSlice';
import { setOnlineUsers } from './redux/chatSlice';
import { setlikeNotifications, setCommentNotification } from './redux/RTN';

import { io } from "socket.io-client";
import "../src/index.css";

const browserRouter = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoutes>
        <MainLayout />
      </ProtectedRoutes>
    ),
    children: [
      { path: "/", element: <Home /> },
      { path: "/profile/:id", element: <Profile /> },
      { path: "/account/edit", element: <EditProfile /> },
      { path: "/chat", element: <ChatWindow /> },
      { path: "/notifications", element: <NotificationPage /> },
      { path: "/search", element: <Search /> },
    ],
  },
  { path: "/signup", element: <Signup /> },
  { path: "/login", element: <Login /> },
]);

function App() {
  const dispatch = useDispatch();
  const { user } = useSelector(store => store.auth);
  const socketRef = useRef(null); // ✅ keep socket out of Redux

  // Check if cookie session is valid on refresh
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/user/me`, {
          method: "GET",
          credentials: "include", // send cookies
        });
        const data = await res.json();
        if (data.success) {
          dispatch(setAuthUser(data.user));
        } else {
          dispatch(setAuthUser(null));
        }
      } catch (err) {
        dispatch(setAuthUser(null));
      }
    };
    checkAuth();
  }, [dispatch]);

  // Socket lifecycle
  useEffect(() => {
    if (!user) {
      socketRef.current?.close();
      socketRef.current = null;
      return;
    }

    const socketio = io(import.meta.env.VITE_API_URL, {
      query: { userId: user._id },
      transports: ["websocket"],
    });

    socketRef.current = socketio;

    socketio.on("getOnlineUsers", (onlineUsers) => {
      dispatch(setOnlineUsers(onlineUsers));
    });

    socketio.on("notification", (notification) => {
      dispatch(setlikeNotifications(notification));
    });

    socketio.on("CommentNotification", (notification) => {
      dispatch(setCommentNotification(notification));
    });

    socketio.on("disconnect", () => {
      console.log("Socket disconnected");
    });

    return () => {
      socketio.close();
    };
  }, [user, dispatch]);

  return <RouterProvider router={browserRouter} />;
}

export default App;