import sharp from "sharp";
import cloudinary from "../utils/cloudinary.js";
import { Post } from "../models/post.model.js";
import { user } from "../models/user.model.js";
import { comment } from "../models/comment.model.js";
import { getRecieverSocketID,io } from '../socket/socket.js';

export const addNewPost = async (req, res) => {
    try {
        const {caption} = req.body;
        const image = req.file;
        const authorID = req.id;

        if (!image) {
            return res.status(400).json({
                message: "image or a video is required"
            })
        }
        //for high quality image upload package name is sharp
        const optimizedImage = await sharp(image.buffer).resize({ width: 800, height: 800, fit: "inside" }).toFormat("jpeg", { quality: 80 }).toBuffer();

        //buffer image into dataURI
        const fileUri = `data:image/jpeg;base64,${optimizedImage.toString('base64')}`
        const cloudResponse = await cloudinary.uploader.upload(fileUri)

        const post = await Post.create({
            caption,
            image: cloudResponse.secure_url,
            author:authorID
        })


        const User = await user.findById(authorID)
        if (User) {
            User.posts.push(post._id);
            await User.save()
        }


        await post.populate({ path: 'author', select: "-password" })
        return res.status(201).json({
            message: "posted successfully",
            post,
            success: true
        })
    } catch (error) {

    }
}

export const getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find()
            .sort({ createdAt: -1 })
            .populate({ path: 'author', select: 'username ProfilePicture' })
            .populate({
                path: 'comments',
                options: { sort: { createdAt: -1 } },
                populate: {
                    path: 'author',
                    select: 'username ProfilePicture'
                }
            });

        return res.status(200).json({
            posts,
            success: true
        })
    } catch (error) {
        console.log(error)
    }
}

export const getUserPosts = async (req, res) => {
    try {
        const authorID = req.id;
        const posts = await Post.find({ author: authorID }).sort({ createdAt: -1 }).populate({
            path: 'author',
            select: 'username ProfilePicture'
        })

        return res.status(200).json({
            posts,
            success: true
        })

    } catch (error) {
        console.log(error)
    }
}

export const likePost = async (req, res) => {
    try {
        const liker = req.id;
        const postID = req.params.id;

        const post = await Post.findById(postID)
        if (!post) return res.status(404).json({ message: 'post not found', success: false })

        await post.updateOne({ $addToSet: { likes: liker } })
        await post.save()

        const User =await user.findById(liker).select('username ProfilePicture')
        const PostOwnerID = post.author.toString()
        if(PostOwnerID !== liker){
            const notification = {
                type:'like',
                userID:liker,
                userDetails:User,
                postID,
                message:'someone liked your post'
            }
            const PostOwnerSocketID = getRecieverSocketID(PostOwnerID)
            io.to(PostOwnerSocketID).emit('notification',notification)
        }

        return res.status(200).json({
            message:"you have liked post",
            success: true
        })
    } catch (error) {
console.log(error)
    }
}

export const unLikePost = async (req, res) => {
    try {
        const liker = req.id;
        const postID = req.params.id;

        const post = await Post.findById(postID)
        if (!post) return res.status(404).json({ message: 'post not found', success: false });

        await post.updateOne({ $pull: { likes: liker } })
        await post.save()

        
        const User =await user.findById(liker).select('username ProfilePicture')
        const PostOwnerID = post.author.toString()
        if(PostOwnerID !== liker){
            const notification = {
                type:'dislike',
                userID:liker,
                userDetails:User,
                postID,
                message:'someone disliked your post'
            }
            const PostOwnerSocketID = getRecieverSocketID(PostOwnerID)
            io.to(PostOwnerSocketID).emit('notification',notification)
        }
return res.status(200).json({
    message:"post unliked",
    success: true
})

    } catch (error) {
console.log(error)
    }
}

export const addComment = async (req,res) =>{
    try {
        const postID = req.params.id;
        const commenter = req.id;
        const {text} = req.body;
        const post = await Post.findById(postID)
        if(!text){
            return res.status(400).json({
                message:"write your comment first then try again",
                success:false
            })
        }

        const Comment =await comment.create({
            text,
            author:commenter,
            post:postID
        })

        await Comment.populate({
            path:'author',
            select:'username ProfilePicture'
        });

        post.comments.push(Comment._id)
        await post.save()

        
        const User = await user.findById(commenter).select('username ProfilePicture')
        const PostOwnerID = post.author.toString()
           if(PostOwnerID !== commenter){
            const notification = {
                type:'comment',
                userID:commenter,
                userDetails:User,
                postID,
                message:'Someone commented on your post'
            }
            const PostOwnerSocketID = getRecieverSocketID(PostOwnerID)
            io.to(PostOwnerSocketID).emit('CommentNotification',notification)
        }


return res.status(201).json({
    message:"comment posted",
    Comment,
    success:true
})

    } catch (error) {
        console.log(error)
    }
}

export const getCommentsOfPost = async(req,res)=>{
    try {
        const postID = req.params.id;
        const Comments = await comment.find({post:postID}).populate('author','username','ProfilePicture');
        if(!Comments) return res.status(404).json({message:"no comments found"})

            return res.status(200).json({
                success:true,
                Comments
            })
    } catch (error) {
        console.log(error)
    }
}

export const deletePost = async (req,res) =>{
try {
    const postID = req.params.id;
    const authorID = req.id;

    const post = await Post.findById(postID);
 

    if(!post){
        return res.status(404).json({
            message:"post not found",
            success:false
        })
    }
    if(post.author.toString() != authorID ){
        return res.status(403).json({message:"you cannot delete someone else's post"})
    }

    await Post.findByIdAndDelete(postID)
    let User = await user.findById(authorID)
    // await User.posts.findByIdAndDelete(postID)

    User.posts = User.posts.filter(id=>id.toString() != postID)
    await User.save()

    await comment.deleteMany({post:postID})
return res.status(200).json({
    message:"post has been deleted",
    success:true
})
} catch (error) {
    console.log(error)
}
}

export const savePost = async(req,res)=>{
    try {
        const postID = req.params.id;
        const authorID = req.id;
        const post =await Post.findById(postID)
        if(!post){
            return res.status(404).json({
                message:"post not found"
            })
        }

        const User = await user.findById(authorID);
        if (User.saved.includes(post._id)){
            await User.updateOne({$pull:{saved:post._id}})
            await User.save()

            return res.status(200).json({type:"unsaved",
                message:"post removed from saved",
                success:true
            })
        } else{
            await User.updateOne({$addToSet:{saved:post._id}})
            await User.save()

            return res.status(200).json({type:"saved",
                message:"post added to saved",
                success:true
            })
        }
    } catch (error) {
        console.log(error)
    }
}

