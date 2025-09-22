import cloudinary, { uploadOnCloudinary } from "../config/cloudinary.js";
import Notification from "../models/notification.model.js";
import User from "../models/user.model.js";
import Vibe from "../models/vibe.user.js";
import { getSocketId, io } from "../socket.js";

export const uploadVibe = async (req, res) => {
  try {
    const { caption } = req.body;
    let media;
    if (req.file) {
      media = await uploadOnCloudinary(req.file.path);
    } else {
      return res.status(400).json({ message: "media is required" });
    }

    const vibe = await Vibe.create({
      caption,
      media,
      author: req.userId,
      mediaId: media.public_id,
    });

    const user = await User.findById(req.userId);
    user.vibes.push(vibe._id);
    await user.save();
    const populatedVibe = await Vibe.findById(vibe._id)
      .populate("author", "name userName profileImage")
      .sort({ createdAt: -1 });
    return res.status(201).json(populatedVibe);
  } catch (error) {
    return res.status(500).json({ message: `vibe upload error ${error}` });
  }
};

export const getAllVibe = async (req, res) => {
  try {
    const vibe = await Vibe.find({})
      .populate("author", "name userName profileImage")
      .populate("comments.author")
      .sort({ createdAt: -1 });
    return res.status(201).json(vibe);
  } catch (error) {
    return res.status(500).json({ message: `get all vibe error ${error}` });
  }
};

export const like = async (req, res) => {
  try {
    const vibeId = req.params.vibeId;
    const vibe = await Vibe.findById(vibeId);
    if (!vibe) {
      return res.status(400).json({ message: "vibe not found" });
    }

    const alreadyLiked = vibe.likes.some(
      (id) => id.toString() == req.userId.toString()
    );

    if (alreadyLiked) {
      vibe.likes = vibe.likes.filter(
        (id) => id.toString() !== req.userId.toString()
      );
    } else {
      vibe.likes.push(req.userId);
      if (vibe.author._id != req.userId) {
        const notification = await Notification.create({
          sender: req.userId,
          receiver: vibe.author._id,
          type: "like",
          vibe: vibeId,
          message: "liked your vibe",
        });
        const populatedNotification = await Notification.findById(
          notification._id
        ).populate("sender receiver vibe");
        const receiverSocketId = getSocketId(vibe.author._id);
        if (receiverSocketId) {
          io.to(receiverSocketId).emit(
            "newNotification",
            populatedNotification
          );
        }
      }
    }

    await vibe.save();
    await vibe.populate("author", "name userName profileImage");
    io.emit("likedOnVibe", {
      vibeId: vibe._id,
      likes: vibe.likes,
    });
    return res.status(201).json(vibe);
  } catch (error) {
    return res.status(500).json({ message: `like vibe error ${error}` });
  }
};

export const comment = async (req, res) => {
  try {
    const { message } = req.body;
    const vibeId = req.params.vibeId;
    const vibe = await Vibe.findById(vibeId);
    if (!vibe) {
      return res.status(400).json({ message: "vibe not found" });
    }
    vibe.comments.push({
      author: req.userId,
      message,
    });
    if (vibe.author._id != req.userId) {
      const notification = await Notification.create({
        sender: req.userId,
        receiver: vibe.author._id,
        type: "comment",
        vibe: vibeId,
        message: "commented on your vibe",
      });
      const populatedNotification = await Notification.findById(
        notification._id
      ).populate("sender receiver vibe");
      const receiverSocketId = getSocketId(vibe.author._id);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("newNotification", populatedNotification);
      }
    }

    await vibe.save();
    await vibe.populate("author", "name userName profileImage");
    await vibe.populate("comments.author");
    io.emit("commentedOnVibe", {
      vibeId: vibe._id,
      comments: vibe.comments,
    });
    return res.status(201).json(vibe);
  } catch (error) {
    return res.status(500).json({ message: `comment vibe error ${error}` });
  }
};

export const deleteVibe = async (req, res) => {
  try {
    const vibeId = req.params.vibeId;
    const userId = req.userId;

    // Find the post
    const vibe = await Vibe.findById(vibeId);
    if (!vibe) {
      return res.status(404).json({ message: "vibe not found" });
    }

    // Check if user is authorized to delete (only post author can delete)
    if (vibe.author.toString() !== userId.toString()) {
      return res
        .status(403)
        .json({ message: "You are not authorized to delete this vibe" });
    }

    // Delete media from Cloudinary if exists
    if (vibe.media) {
      try {
        let publicId;
        if (vibe.mediaId) {
          publicId = vibe.mediaId; // safer
        } else {
          const parts = vibe.media.split("/");
          const fileName = parts.pop().split(".")[0];
          const folder = parts.slice(parts.indexOf("upload") + 1).join("/");
          publicId = folder ? `${folder}/${fileName}` : fileName;
        }

        await cloudinary.uploader.destroy(publicId, {
          resource_type: vibe.mediaType || "image",
        });
      } catch (cloudErr) {
        console.log("Cloudinary deletion error:", cloudErr);
      }
    }

    // Remove post from user's posts array
    const user = await User.findById(userId);
    user.vibes = user.vibes.filter((id) => id.toString() !== vibeId.toString());
    await user.save();

    // Remove post from all users' saved posts
    await User.updateMany({ saved: vibeId }, { $pull: { saved: vibeId } });

    // Delete all notifications related to this post
    await Notification.deleteMany({ vibe: vibeId });

    // Delete the post
    await Vibe.findByIdAndDelete(vibeId);

    // Emit socket event to notify all users about post deletion
    io.emit("vibeDeleted", {
      vibeId: vibeId,
      authorId: userId,
    });

    // Send success response
    return res.status(200).json({
      message: "vibe deleted successfully",
      vibeId: vibeId,
    });
  } catch (error) {
    console.error("Delete vibe error:", error);
    return res.status(500).json({
      message: `Delete vibe error: ${error.message}`,
    });
  }
};
