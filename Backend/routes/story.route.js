import express from "express"
import isAuth from "../middlewares/isAuth.js";
import { upload } from "../middlewares/multer.js";
import { deleteStory, getallStories, getStoryByUserName, uploadStory, viewStory } from "../controllers/story.controllers.js";


const storyRouter = express.Router()


storyRouter.post("/upload", isAuth, upload.single("media"), uploadStory)
storyRouter.get("/getByUserName/:userName", isAuth, getStoryByUserName)
storyRouter.get("/view/:storyId", isAuth, viewStory)
storyRouter.get("/getallStories", isAuth, getallStories)
storyRouter.delete("/deleteStory/:storyId", isAuth, deleteStory)

export default storyRouter;