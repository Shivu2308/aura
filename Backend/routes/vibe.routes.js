import express from "express"
import isAuth from "../middlewares/isAuth.js";
import { upload } from "../middlewares/multer.js";
import { comment, deleteVibe, getAllVibe, like, uploadVibe } from "../controllers/vibe.controllers.js";


const vibeRouter = express.Router()


vibeRouter.post("/upload", isAuth, upload.single("media"), uploadVibe)
vibeRouter.get("/getAllVibes", isAuth, getAllVibe)
vibeRouter.get("/like/:vibeId", isAuth, like)
vibeRouter.post("/comment/:vibeId", isAuth, comment)
vibeRouter.delete("/deleteVibe/:vibeId", isAuth, deleteVibe)
// vibeRouter.get("/saved/:postId", isAuth,  saved)

export default vibeRouter;