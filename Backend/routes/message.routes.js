import express from "express"
import isAuth from "../middlewares/isAuth.js";
import { upload } from "../middlewares/multer.js";
import { getAllMessages, getPrevUserChat, sendMessage } from "../controllers/message.controllers.js";


const messageRouter = express.Router()


messageRouter.post("/send/:reciverId", isAuth, upload.single("image"), sendMessage)
messageRouter.get("/getAllMessages/:reciverId", isAuth, getAllMessages)
messageRouter.get("/prevChats", isAuth, getPrevUserChat)

export default messageRouter;