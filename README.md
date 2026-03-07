# 📸 InstaClone – Full Stack Social Media Platform

A full-stack **Instagram-like social media application** built with the **MERN Stack** that allows users to create posts, follow other users, chat in real-time, share stories, and receive live notifications.

The application supports **authentication, real-time messaging, image uploads, likes, comments, saved posts, and story features**, along with **Socket.io for real-time updates**.

---

# 🚀 Features

## 👤 Authentication
- User Registration
- Secure Login with JWT
- Logout functionality
- Protected routes using authentication middleware
- Cookie-based session handling

---

## 📷 Posts
- Create new posts with image upload
- Optimized image upload using **Sharp**
- Store images using **Cloudinary**
- Like and unlike posts
- Comment on posts
- Delete own posts
- View all posts
- View posts from a specific user
- Save/unsave posts

---

## 📚 Stories
- Upload temporary stories
- Stories automatically expire after **24 hours**
- View stories from users you follow
- View your own stories

---

## 💬 Real-Time Chat
- One-to-one messaging
- Send text messages
- Share posts inside chats
- Messages stored in MongoDB
- Live message delivery using **Socket.io**

---

## 🔔 Real-Time Notifications
Users receive live notifications for:

- Post likes
- Post comments
- Chat messages

Notifications are delivered instantly via **WebSockets**.

---

## 👥 Social Features
- Follow users
- Unfollow users
- Suggested users to follow
- View followers and following

---

## ⚡ Real-Time Online Users
The system tracks currently online users using **Socket.io**.

---

# 🛠️ Tech Stack

## Frontend
- **React**
- **Vite**
- **Redux Toolkit**
- **Redux Persist**
- **Tailwind CSS**
- **Axios**
- **Socket.io Client**
- **Sonner (Notifications)**

---

## Backend
- **Node.js**
- **Express.js**
- **MongoDB**
- **Mongoose**
- **Socket.io**
- **JWT Authentication**
- **Multer (File Uploads)**
- **Sharp (Image Optimization)**
- **Cloudinary (Image Hosting)**
- **Cookie Parser**
- **CORS**

---

# 📂 Project Structure

Instaclone
│
├── client
│ ├── src
│ │ ├── components
│ │ ├── redux
│ │ ├── pages
│ │ ├── hooks
│ │ ├── lib
│ │ └── utils
│
├── server
│ ├── controllers
│ ├── models
│ ├── routes
│ ├── middlewares
│ ├── socket
│ ├── utils
│ └── index.js


---

# ⚙️ Installation

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/wVishal007/INSTACLONE

cd server
npm install

cd client
npm install

PORT=3000

MONGO_URI=your_mongodb_connection

SECRET_KEY=your_jwt_secret

FRONT_URL=http://localhost:5173

CLOUD_NAME=your_cloudinary_name
API_KEY=your_cloudinary_key
API_SECRET=your_cloudinary_secret

cd server
npm run dev

cd client
npm run dev

🌐 API Endpoints
User Routes
POST   /api/v1/user/register
POST   /api/v1/user/login
GET    /api/v1/user/logout
GET    /api/v1/user/:id/profile
POST   /api/v1/user/profile/edit
GET    /api/v1/user/suggested
POST   /api/v1/user/followorUnfollow/:id
POST   /api/v1/user/saved
Post Routes
POST   /api/v1/post/addpost
GET    /api/v1/post/all
GET    /api/v1/post/userpost/all
GET    /api/v1/post/:id/like
GET    /api/v1/post/:id/unlike
POST   /api/v1/post/:id/comment
GET    /api/v1/post/:id/comment/all
DELETE /api/v1/post/delete/:id
POST   /api/v1/post/:id/save
Story Routes
POST /api/v1/story/addstory
GET  /api/v1/story/allstories
GET  /api/v1/story/myStory
Message Routes
POST /api/v1/message/send/:id
POST /api/v1/message/sendPost/:id
GET  /api/v1/message/all/:id
🔄 Real-Time Features (Socket.io)

Socket events include:

newMessage
newPostMessage
notification
CommentNotification
getOnlineUsers

These enable:

Real-time chat

Real-time notifications

Online user tracking

🖼 Image Handling

Images are:

Uploaded using Multer

Optimized using Sharp

Converted to Data URI

Uploaded to Cloudinary

This ensures fast loading and optimized image sizes.

🔒 Authentication Flow

User logs in

Server generates JWT token

Token stored in HTTP-only cookies

Middleware verifies token for protected routes

req.id is extracted from token payload

🧠 Redux State Management

Redux manages global state for:

auth
posts
chat
socket
realTimeNotifications

Redux Persist stores important state across refresh.

📈 Future Improvements

Possible improvements for scaling the platform:

Message pagination

Redis caching

Rate limiting

Push notifications

Media CDN optimization

Group chats

Story reactions

Explore page algorithm

Search functionality

📜 License

This project is licensed under the MIT License.

👨‍💻 Author

Vishal Singh

Full Stack Developer

GitHub:
https://github.com/wVishal007/

⭐ Support

If you like this project, please consider giving it a star on GitHub ⭐.


---

✅ This README is **portfolio-level quality** and good for:
- GitHub
- resume projects
- hackathon demos
- recruiters reviewing your repo

---
