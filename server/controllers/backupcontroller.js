import { user } from "../models/user.model.js";
import jwt from 'jsonwebtoken'
import bcrypt from "bcryptjs";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";

const User = user

export const register = async (req,res)=>{
    try{
        const {username,email,password} = req.body;

        if(!username || !email || !password){
            return res.status(401).json({
                message:"something is missing",
                success:false
            })
        }
        const User = await user.findOne({email});

        if(User){
            return res.status(401).json({
                message:"this email is already registered",
                success:false
            })
        }
const hashedpassword = await bcrypt.hash(password,7)
        await user.create({
            username,
            email,
            password:hashedpassword
        })
        return res.status(201).json({
            message:"account created successfully",
            success:true
        })

    } catch(error){
        console.log("error occured in signup",error)
    }
}



export const login = async (req,res)=>{
    try{
const {email,password} = req.body;
if(!email || !password){
    return res.status(401).json({
        message:"enter your email and password respectively",
        success:false
    });
}
let User = await user.findOne({email});
if(!User){
    return res.status(401).json({
        message:"incorrect email or password",
        success:false
    }); 
}

const isPasswordMatch = await bcrypt.compare(password,User.password)
if(!isPasswordMatch){
    return res.status(401).json({
        message:"incorrect email or password",
        success:false
    });
}

const token = await jwt.sign({userID:user._id},"yami2406",{expiresIn:'1d'})
return res.cookie("token",token,{httpOnly:true,samesite:'strict',maxAge:1*24*60*60*1000}).json({
    message:`welcome back ${user.username}`,
    sucess:true,
    id:token
})
    } catch(error){
        console.error(error)
    }
}

export const logout = async(_,res)=>{
    try{
return res.cookie("token","",{maxAge:0}).json({
    message:"logged out successfully"
})
    } catch(error){
        console.log(error)
    }
}

export const getprofile = async (req,res)=>{
    try{
const userID = req.params.id;
let User = await user.findById(userID)
return res.status(200).json({
    message:'found id successfully'
})
    } catch(error){
console.log(error)
    }
}

export const editprofile = async (req,res)=>{
    try{
        const {bio,gender} = req.body;
        const profilePicture = req.file;
        
const userID = req.id;
let cloudResponse;
if(profilePicture){
const fileUri = getDataUri(profilePicture)
await cloudinary.uploader.upload(fileUri)
}
const User = await user.findById(userID);
if(!User){
    return res.status(404).json({
        message:"user not found",
        success:false
    })
};
if (bio) user.bio = bio;
if(gender) user.gender = gender;
if(profilePicture) user.ProfilePicture = cloudResponse.secure_url;

await user.save();
return res.status(200).json({
    message:"profile updated successfully",//profile update ho gyii aura +10000
    success:true
})

    } catch(error){
console.log(error)
    }
}

export const getSuggestedUsers =async (req,res) =>{
    try {
        const SuggestedUsers = await user.find({_id:{$ne:req.id}}).select("-password");//pasword chhod ke baki data lake dede mujhe tu
        if(!SuggestedUsers){
            return res.status(400).json({
                message:"no suggested users",
                success:false
            })
        }
        return res.status(200).json({
            message:"fetched suggested users",
            users:SuggestedUsers,//le ye le dhundle jise dhund raha hai
            success:true
        })
    } catch (error) {
        console.log(error)
    }

};

export const followOrUnfollow = async(req,res)=>{
    try {
        const sendfollow = req.id;//meri id
        const getfollow = req.params.id;//crush ki id

        if(sendfollow === getfollow){
            return res.status(400).json({
                message:'you can not follow yourself'//bhai dono ek hi id hai sahi se req mar
            })
        }
        const User = user.findById(sendfollow)
        const targetUser = user.findById(getfollow)
        if(!User || !targetUser){
            return res.status(400).json({
                message:'user not found'
            })
        }

        //checking follow and unfollow
        const isfollowing = User.following.includes(sendfollow)
        if(isfollowing){
            user.updateOne({_id:sendfollow}, {$pull: {following: sendfollow}}),
            user.updateOne({_id:getfollow}, {$pull: {followers: getfollow}})

            return res.status(200).json({
                message:"unfollowed successfully",
                success:true
            })
        } 
        else{
await Promise.all([
    user.updateOne({_id:sendfollow}, {$push: {following: sendfollow}}),
    user.updateOne({_id:getfollow}, {$push: {followers: getfollow}})
 
])

return res.status(200).json({
    message:"followed successfully",
    success:true
})
        }
    } catch (error) {
        console.log(error)
    }
}