import mongoose from "mongoose";


const stortSchema = new mongoose.Schema({
    author:{
            type:mongoose.Schema.Types.ObjectId,
            ref: "User",
            required : true
        },
        mediaType:{
            type:String,
            enum:['image', 'video'],
            required : true,
        },
        media:{
            type:String,
            required : true,
        },
        mediaId: {
       type: String 
      },
        viewers:[{
            type:mongoose.Schema.Types.ObjectId,
            ref: "User",
            required : true
        }],
        createdAt:{
            type:Date,
            default:Date.now(),
            expires: 86400,                 // 24*60*60
        }
},{timestamps:true})


const Story = mongoose.model("Story", stortSchema);
export default Story;