import React, { useEffect, useState } from 'react'
import assets from '../assets/assets'
import { FiPlusCircle } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import axios from 'axios'
import { servalUrl } from '../App'

const StoryDp = ({ profileImage, userName, story }) => {
    const [viewed, setViewed] = useState(false)
    const navigate = useNavigate()
    const { userData } = useSelector(state => state.user)
    const { storyData, allStoriesData } = useSelector(state => state.story)
    // console.log(story._id)


    useEffect(() => {
        if( story?.viewers?.some((viewer) => 
        viewer?._id?.toString() === userData._id.toString() || viewer?.toString() === userData._id.toString()  )){
            setViewed(true)
        }else{
            setViewed(false)
        }
        
    }, [story, userData, storyData, allStoriesData])
    
    
    const handleViewers = async () => {
        try {
            const result = await axios.get(`${servalUrl}/api/story/view/${story._id}`, {withCredentials:true})
        } catch (error) {
            // console.log(error)
        }
    }


    const handlrClick = () => {
        if(!story && userName == "Your Story"){
            navigate('/upload')
        }else if(story && userName == "Your Story"){
            handleViewers()
            navigate(`/story/${userData?.userName}`)
        }else{
            handleViewers()
            navigate(`/story/${userName}`)
        }
    }

    return (
        <div className='w-[80px] flex-flex-col' >
            <div onClick={handlrClick} className={`w-[80px] h-[80px] rounded-full flex justify-center items-center relative ${!story ? null : !viewed ? `bg-gradient-to-r from-[#E17DD7] to to-[#97E8DF]` : "bg-gradient-to-l from-gray-500 to-[#192533]"}`}>
                <div className='w-[70px] h-[70px] rounded-full border-2 border-black cursor-pointer overflow-hidden '>
                    <img className='w-full h-full object-cover' src={profileImage || assets.avataricon} alt="" />
                    {!story && userName == "Your Story" && 
                        <FiPlusCircle className='text-black bg-white bottom-[8px] right-[10px] rounded-full absolute w-[20px] h-[20px]' />

                    }
                </div>
            </div>
            <div className='text-[14px] text-center truncate w-full text-white mt-1'>{userName}</div>
        </div>
    )
}

export default StoryDp
