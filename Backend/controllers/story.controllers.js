
import cloudinary, { uploadOnCloudinary } from "../config/cloudinary.js"
import Story from "../models/story.model.js"
import User from "../models/user.model.js"
import { io } from "../socket.js"



//upload story

export const uploadStory = async (req, res) => {
    try {
        const user = await User.findById(req.userId)
        if(user.story){
            await Story.findByIdAndDelete(user.story)
            user.story = null;
        }
        const {mediaType} = req.body;
        let media;
        if(req.file){
            media = await uploadOnCloudinary(req.file.path)
        }else{
            return res.status(400).json({message : "media required"})
        }

        const story = await Story.create({author : req.userId, mediaType, media, mediaId: media.public_id})
        user.story = story._id
        await user.save()
        const populatedStory = await Story.findById(story._id).populate("author", "name userName profileImage");
        return res.status(200).json(populatedStory)

    } catch (error) {
        return res.status(500).json({message:`upload story error ${error}`})
    }
}


// add story viewesrs
export const viewStory = async (req, res) => {
    try {
        const storyId = req.params.storyId
        const story = await Story.findById(storyId)
        if( !story ){
            return res.status(400).json({message : "story not found"})
        }

        const viewersIds = story.viewers.map(id => id.toString())
        if( !viewersIds.includes(req.userId.toString()) ){
            story.viewers.push(req.userId)
            await story.save()
        }

        const populatedStory = await Story.findById(story._id).populate("author", "name userName profileImage")
        return res.status(200).json(populatedStory)

    } catch (error) {
        return res.status(500).json({message:`view story error ${error}`})
    }
}



export const getStoryByUserName = async (req, res) => {
    try {
        const userName = req.params.userName
        const user = await User.findOne({userName})
        if( !user ){
            return res.status(400).json({message : "user not found"})
        }

        const story = await Story.find({author:user._id}).populate("viewers author")
        return res.status(200).json(story)

    } catch (error) {
        return res.status(500).json({message:`get story by user name error ${error}`})
    }
}


export const getallStories = async (req, res) => {
    try {
        const currentUser = await User.findById(req.userId)
        const followingIds = currentUser.following
        const stories = await Story.find({
            author : {$in : followingIds}
        }).populate("viewers author").sort({ createdAt: -1 })

        return res.status(200).json(stories)
        
    } catch (error) {
        return res.status(500).json({message:`get all story error ${error}`})
    }
}








export const deleteStory = async (req, res) => {
  try {
    const storyId = req.params.storyId;
    const userId = req.userId;

    // Find story
    const story = await Story.findById(storyId);
    if (!story) {
      return res.status(404).json({ message: "Story not found" });
    }

    // Authorization check
    if (story.author.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Not authorized to delete this story" });
    }

    // Delete media from Cloudinary (if available)
    if (story.media) {
      try {
        let publicId;
        if (story.mediaId) {
          publicId = story.mediaId;
        } else {
          const parts = story.media.split("/");
          const fileName = parts.pop().split(".")[0];
          const folder = parts.slice(parts.indexOf("upload") + 1).join("/");
          publicId = folder ? `${folder}/${fileName}` : fileName;
        }

        await cloudinary.uploader.destroy(publicId, {
          resource_type: story.mediaType === "video" ? "video" : "image",
        });
      } catch (cloudErr) {
        console.log("Cloudinary deletion error:", cloudErr);
      }
    }

    // Remove story reference from user
    const user = await User.findById(userId);
    if (user.story?.toString() === storyId.toString()) {
      user.story = null;
      await user.save();
    }

    await Story.findByIdAndDelete(storyId);


    return res.status(200).json({ message: "Story deleted successfully", storyId });
  } catch (error) {
    console.error("Delete story error:", error);
    return res.status(500).json({ message: `Delete story error: ${error.message}` });
  }
};
