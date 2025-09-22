import mongoose from "mongoose";

const registerUserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true, 
        unique: true,
    },
    otp: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 300         
    }
});


const RegisterUser = mongoose.model("RegisterUser", registerUserSchema);
export default RegisterUser;

