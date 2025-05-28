import { Story } from "../models/story.model.js";
import { user } from "../models/user.model.js";
import cloudinary from "../utils/cloudinary.js";
import sharp from "sharp";

export const addStory = async (req, res) => {
    try {
        const authorId = req.id;
        const image = req.file;
        console.log('adding story');


        if (!image) {
            return res.status(404).json({
                success: false,
                message: 'image not found'
            })
        }

        const optimizedImage = await sharp(image.buffer).resize({ width: 800, height: 800, fit: "inside" }).toFormat("jpeg", { quality: 80 }).toBuffer();
        //buffer image into dataURI
        const fileUri = `data:image/jpeg;base64,${optimizedImage.toString('base64')}`
        const cloudResponse = await cloudinary.uploader.upload(fileUri)
        const expiresIn = 24 * 60 * 60 * 1000;
        const story = await Story.create({
            author: authorId,
            image: cloudResponse.secure_url,
            expiresAt: new Date(Date.now() + expiresIn),
        })

        const User = await user.findById(authorId)
        User.stories.push(story._id)
        await User.save()

        return res.status(200).json({
            success: true,
            message: "story uploaded Successfully",
            story
        })

    } catch (error) {
        console.log(error);

    }
}

export const getAllStories = async (req, res) => {
  try {
    const userId = req.id; // or req.user.id depending on your auth middleware

    // Find the user with populated following array
    const User = await user.findById(userId).populate('following');

    if (!User) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Extract the array of followed user IDs
    const followingIds = User.following.map(followedUser => followedUser._id);
    // Find stories where author is in followingIds
    const stories = await Story.find({ author: { $in: followingIds } })
      .populate('author', 'username ProfilePicture') // populate author info as needed
      .sort({ createdAt: -1 }); // optional: sort by latest story first


    res.status(200).json({ success:true,stories });
  } catch (error) {
    console.error('Error fetching stories:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getMystories = async (req, res) => {
  try {
    const userId = req.id;

    // Make sure userId exists
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID not found in request.",
      });
    }

    const mystories = await Story.find({ author: userId }).sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      data: mystories,
    });
  } catch (error) {
    console.error('Error fetching user stories:', error);
    return res.status(500).json({
      success: false,
      message: 'Server Error. Could not fetch your stories.',
    });
  }
};


