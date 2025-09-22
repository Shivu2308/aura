
import express from "express"
import isAuth from "../middlewares/isAuth.js";
import { upload } from "../middlewares/multer.js";
import { comment, deletePost, getAllPost, like, saved, uploadPost } from "../controllers/post.controllers.js";


const postRouter = express.Router()


postRouter.post("/upload", isAuth, upload.single("media"), uploadPost)
postRouter.get("/getAllPosts", isAuth, getAllPost)
postRouter.get("/like/:postId", isAuth, like)
postRouter.post("/comment/:postId", isAuth, comment)
postRouter.get("/saved/:postId", isAuth,  saved)
postRouter.delete('/delete/:postId', isAuth, deletePost)

export default postRouter;