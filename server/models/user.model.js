import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },

    email: { type: String, required: true, unique: true },

    password: { type: String, required: true },

    ProfilePicture: { type: String, default: "" },

    Bio: { type: String, default: "" },

    gender: { type: String, enum: ['male', 'female'] },

    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user' }],

    following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user' }],

    posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],

    saved: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
    stories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Story' }]
}, { timestamps: true });

export const user = mongoose.model('user', userSchema)