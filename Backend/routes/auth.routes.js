import express from "express"
import { resetPassword, sendOtp, sendOtpToRegisterUser, signOut, singIn, singUp, verifyOtp, verifyUserOtp } from "../controllers/auth.controllers.js";


const authRouter = express.Router()


authRouter.post("/registerUsersendOTP", sendOtpToRegisterUser)
authRouter.post("/verifyOtp", verifyOtp)

authRouter.post("/signup", singUp)
authRouter.post("/signin", singIn)
authRouter.get("/signout", signOut)
authRouter.post("/sendotp", sendOtp)
authRouter.post("/verifyUserOtp", verifyUserOtp)
authRouter.post("/resetPassword", resetPassword)

export default authRouter;