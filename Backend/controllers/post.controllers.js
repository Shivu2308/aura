
import cloudinary, { uploadOnCloudinary } from "../config/cloudinary.js";
import Notification from "../models/notification.model.js";
import Post from "../models/post.model.js";
import User from "../models/user.model.js";
import { getSocketId, io } from "../socket.js";

export const uploadPost = async (req, res) => {
    try {
        const { mediaType, caption } = req.body;
        let media;
        if(req.file){
            media = await uploadOnCloudinary(req.file.path)
            // console.log(media);
        }else{
            return res.status(400).json({message : "media is required"})
        }

        const post = await Post.create({
            caption, media, mediaType, author:req.userId, mediaId: media.public_id,
        })

        const user = await User.findById(req.userId)
        user.post.push(post._id)
        await user.save()
        const populatedPost = await Post.findById(post._id).populate("author", "name userName profileImage")
        return res.status(201).json(populatedPost)

    } catch (error) {
        return res.status(500).json({message : `post upload error ${error}`})
    }
}


export const getAllPost = async (req, res) => {
    try {
        const post = await Post.find({}).populate("author", "name userName profileImage").populate("comments.author", "name userName profileImage").sort({createdAt:-1})
        return res.status(201).json(post)
    } catch (error) {
        return res.status(500).json({message : `get all posts error ${error}`})
    }
}


export const like = async (req, res) => {
    try {
        const postId = req.params.postId
        const post = await Post.findById(postId)
        if( !post ){
            return res.status(400).json({message : "post not found"})
        }

        const alreadyLiked = post.likes.some(id=> id.toString() == req.userId.toString())

        if( alreadyLiked ) {
            post.likes = post.likes.filter(id => id.toString()  !== req.userId.toString() )
        }else{
            post.likes.push(req.userId)
            if(post.author._id != req.userId){
                const notification = await  Notification.create({
                    sender : req.userId,
                    receiver : post.author._id,
                    type : "like",
                    post : postId,
                    message : "liked your post"
                })
                const populatedNotification = await Notification.findById(notification._id).populate("sender receiver post")
                const receiverSocketId = getSocketId(post.author._id)
                if(receiverSocketId){
                    io.to(receiverSocketId).emit("newNotification", populatedNotification)
                }
            }
        }

        
        await post.save()
        await post.populate("author", "name userName profileImage")

        io.emit("likedOnPost", {
            postId:post._id,
            likes:post.likes
        })
        return res.status(201).json(post)

    } catch (error) {
        return res.status(500).json({message : `like posts error ${error}`})
    }
}


export const comment = async (req, res) => {
    try {
        const { message } = req.body
        const postId = req.params.postId
        const post = await Post.findById(postId)
        if( !post ){
            return res.status(400).json({message : "post not found"})
        }
        post.comments.push({
            author : req.userId,
            message
        })

         if(post.author._id != req.userId){
                const notification = await  Notification.create({
                    sender : req.userId,
                    receiver : post.author._id,
                    type : "comment",
                    post : postId,
                    message : "commented on your post"
                })
                const populatedNotification = await Notification.findById(notification._id).populate("sender receiver post")
                const receiverSocketId = getSocketId(post.author._id)
                if(receiverSocketId){
                    io.to(receiverSocketId).emit("newNotification", populatedNotification)
                }
            }

        await post.save()
        await post.populate("author", "name userName profileImage")
        await post.populate("comments.author")

        io.emit("commentedOnPost", {
            postId:post._id,
            comments:post.comments
        })
        return res.status(201).json(post)

    } catch (error) {
        return res.status(500).json({message : `comment posts error ${error}`})
    }
}

export const saved = async (req, res) => {
    try {
        const postId = req.params.postId

        const user = await User.findById(req.userId)

        const alreadySaved = user.saved.some(id=> id.toString() == postId.toString())

        if( alreadySaved ) {
            user.saved = user.saved.filter(id => id.toString()  !== postId.toString())
        }else{
            user.saved.push(postId)
        }

        await user.save()
        await user.populate("saved",)
        return res.status(200).json(user)

    } catch (error) {
        return res.status(500).json({message : `saved posts error ${error}`})
    }
}



export const deletePost = async (req, res) => {
    try {
        const postId = req.params.postId;
        const userId = req.userId;

        // Find the post
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        // Check if user is authorized to delete (only post author can delete)
        if (post.author.toString() !== userId.toString()) {
            return res.status(403).json({ message: "You are not authorized to delete this post" });
        }

        // Delete media from Cloudinary if exists
        if (post.media) {
            try {
                // Extract public_id from cloudinary URL
                const publicId = post.media.split('/').pop().split('.')[0];
                
                // Delete from cloudinary based on media type
                if (post.mediaType === 'video') {
                    await cloudinary.uploader.destroy(publicId, { resource_type: "video" });
                } else {
                    await cloudinary.uploader.destroy(publicId);
                }
            } catch (cloudinaryError) {
                console.log('Cloudinary deletion error:', cloudinaryError);
                // Continue with post deletion even if cloudinary deletion fails
            }
        }

        // Remove post from user's posts array
        const user = await User.findById(userId);
        user.post = user.post.filter(id => id.toString() !== postId.toString());
        await user.save();

        // Remove post from all users' saved posts
        await User.updateMany(
            { saved: postId },
            { $pull: { saved: postId } }
        );

        // Delete all notifications related to this post
        await Notification.deleteMany({ post: postId });

        // Delete the post
        await Post.findByIdAndDelete(postId);

        // Emit socket event to notify all users about post deletion
        io.emit("postDeleted", {
            postId: postId,
            authorId: userId
        });

        // Send success response
        return res.status(200).json({ 
            message: "Post deleted successfully",
            postId: postId 
        });

    } catch (error) {
        console.error('Delete post error:', error);
        return res.status(500).json({ 
            message: `Delete post error: ${error.message}` 
        });
    }
}