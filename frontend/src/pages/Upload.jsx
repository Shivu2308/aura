import React, { useRef, useState } from 'react'
import { LuCirclePlus } from 'react-icons/lu'
import { MdOutlineKeyboardBackspace } from 'react-icons/md'
import { useNavigate } from 'react-router-dom'
import VideoPlayer from '../components/VideoPlayer'
import axios from 'axios'
import { servalUrl } from '../App'
import { useDispatch, useSelector } from 'react-redux'
import { setPostData } from '../redux/postSlice'
import { setVibeData } from '../redux/vibeSlice'
import { setCurrentUserStory, setStoryData } from '../redux/storySlice'
import { ClipLoader } from 'react-spinners'
import { setUserData } from '../redux/userSlice'

const Upload = () => {
  const [uploadType, setUploadType] = useState("post")
  const [frontendMedia, setFrontendMedia] = useState(null)
  const [backendMedia, setBackendMedia] = useState(null)
  const [mediaType, setMediaType] = useState('')
  const [caption, setCaption] = useState('')
  const [loading, setLoading] = useState(false)

  const mediaInput = useRef()

  const navigate = useNavigate()

  const dispatch = useDispatch()

  const { postData } = useSelector(state => state.post)
  const { storyData } = useSelector(state => state.story)
  const { vibeData } = useSelector(state => state.vibe)

  const handleMedia = (e) => {
    const file = e.target.files[0]
    // console.log(file)
    if (file.type.includes("image")) {
      setMediaType("image")
    } else {
      setMediaType("video")
    }
    setBackendMedia(file)
    setFrontendMedia(URL.createObjectURL(file))
  }

  const uploadPost = async () => {
    setLoading(true)
    try {
      const formData = new FormData()
      // console.log(backendMedia)
      formData.append("caption", caption)
      formData.append('mediaType', mediaType)
      formData.append('media', backendMedia)
      // console.log("caption:", caption);
      // console.log("mediaType:", mediaType);
      // console.log("backendMedia:", backendMedia);

      // for (let pair of formData.entries()) {
      //   console.log(pair[0] + ':', pair[1]);
      // }

      const result = await axios.post(`${servalUrl}/api/post/upload`, formData, {withCredentials: true})
      // console.log(result)
      dispatch(setPostData([...postData, result.data]))
      setLoading(false)
      setBackendMedia(null)
      setFrontendMedia(null)
      navigate('/')
    } catch (error) {
      console.log(error)
      setLoading(false)
    }
  }

  const uploadVibe = async () => {
    setLoading(true)
    try {
      const formData = new FormData()
      formData.append("caption", caption)
      formData.append('mediaType', mediaType)
      formData.append('media', backendMedia)

      const result = await axios.post(`${servalUrl}/api/vibe/upload`, formData, { withCredentials: true })
      // console.log(result)
      dispatch(setVibeData([...vibeData, result.data]))
      setLoading(false)
      setBackendMedia(null)
      setFrontendMedia(null)
      navigate('/')
    } catch (error) {
      // console.log(error)
      setLoading(false)
    }
  }



  const uploadStory = async () => {
    setLoading(true)
    try {
      const formData = new FormData()
      formData.append('mediaType', mediaType)
      formData.append('media', backendMedia)

      const result = await axios.post(`${servalUrl}/api/story/upload`, formData, { withCredentials: true })
      // console.log(result)
      dispatch(setCurrentUserStory(result.data))
      // setUserData((prev) => ({...prev, story:result.data}))
      setLoading(false)
      setBackendMedia(null)
      setFrontendMedia(null)
      navigate('/')
    } catch (error) {
      // console.log(error)
      setLoading(false)
    }
  }

  const handleUpload = () => {
    if (uploadType == "post") {
      uploadPost()
    } else if (uploadType == "story") {
      uploadStory()
    } else {
      uploadVibe()
    }
  }


  return (
    <div className='w-full h-[100vh] bg-black flex flex-col items-center'>
      <div className='w-full h-[80px] flex items-center gap-[20px] px-[20px]'>
        <MdOutlineKeyboardBackspace className='text-white w-[25px] h-[25px] cursor-pointer' onClick={() => navigate(`/`)} />
        <h1 className='text-white text-[20px] font-semibold'>Upload</h1>
      </div>

      <div className='w-[90%] max-w-[600px] h-[70px] bg-white rounded-full flex justify-around items-center gap-[10px]'>
        <div onClick={() => setUploadType("post")}
          className={`w-[28%] h-[80%] flex justify-center items-center text-[19px] font-semibold cursor-pointer hover:bg-black rounded-full hover:text-white  hover:shadow-2xl hover:shadow-black ${uploadType === "post" ? "bg-black text-white shadow-2xl shadow-black" : ""}`}>Post</div>
        <div onClick={() => setUploadType("story")}
          className={`w-[28%] h-[80%] flex justify-center items-center text-[19px] font-semibold cursor-pointer hover:bg-black rounded-full hover:text-white  hover:shadow-2xl hover:shadow-black ${uploadType === "story" ? "bg-black text-white shadow-2xl shadow-black" : ""}`}>Story</div>
        <div onClick={() => setUploadType("vibe")}
          className={`w-[28%] h-[80%] flex justify-center items-center text-[19px] font-semibold cursor-pointer hover:bg-black rounded-full hover:text-white  hover:shadow-2xl hover:shadow-black ${uploadType === "vibe" ? "bg-black text-white shadow-2xl shadow-black" : ""}`}>Vibe</div>
      </div>





      {!frontendMedia &&
        <div onClick={() => mediaInput.current.click()}
          className='w-[80%] max-w-[500px] h-[250px] bg-[#0e1316] border-gray-800 border-2 flex flex-col items-center justify-center gap-2 mt-[15vh] rounded-2xl cursor-pointer hover:bg-[#353a3d]'>
          <input type="file" accept={uploadType == "vibe" ? "video/*" : ""} hidden ref={mediaInput} onChange={handleMedia} />
          <LuCirclePlus className='text-white w-[25px] h-[25px] cursor-pointer' />
          <div disabled = {loading} className='text-white text-[19px] font-semibold'>upload {uploadType}</div>
        </div>
      }

      {frontendMedia &&
        <div className='w-[80%] max-w-[500px] h-[250px] flex flex-col items-center justify-center mt-[15vh]'>
          {mediaType == "image" &&
            <div className='w-[80%] max-w-[500px] h-[250px] flex flex-col items-center justify-center mt-[5vh]'>
              <img className='h-[60%] rounded-2xl' src={frontendMedia} alt="" />
              {uploadType != "story" &&
                <input onChange={(e) => setCaption(e.target.value)}
                  type="text" value={caption} className='w-full border-b-gray-400 border-b-2 outline-none px-[10px] py-[5px] text-white mt-[20px]' placeholder='Write Caption' />}
            </div>}

          {mediaType == "video" &&
            <div className='w-[80%] max-w-[500px] h-[250px] flex flex-col items-center justify-center mt-[5vh]'>
              <VideoPlayer media={frontendMedia} />
              {uploadType != "story" &&
                <input onChange={(e) => setCaption(e.target.value)}
                  type="text" value={caption} className='w-full border-b-gray-400 border-b-2 outline-none px-[10px] py-[5px] text-white mt-[20px]' placeholder='Write Caption' />}
            </div>}
        </div>
      }
      {frontendMedia && <button onClick={handleUpload}
      disabled = {loading}
        className='px-[10px] w-[60%] max-w-[400px] py-[5px] h-[50px] bg-white mt-[50px] cursor-pointer rounded-2xl font-semibold'>{loading ? <ClipLoader size={30} color='black' /> : `Upload ${uploadType}`}</button>}
    </div>
  )
}

export default Upload
