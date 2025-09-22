import axios from 'axios'
import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { servalUrl } from '../App'
import { useDispatch, useSelector } from 'react-redux'
import { setStoryData } from '../redux/storySlice'
import StoryCard from '../components/StoryCard'

const Story = () => {

    const { storyData } = useSelector(state => state.story)
    const { userName } =useParams()
    const dispatch = useDispatch()

    const handeStory = async () => {
      dispatch(setStoryData(null))
        try {
            const result = await axios.get(`${servalUrl}/api/story/getByUserName/${userName}`, {withCredentials:true})
            // console.log(result.data[0])
            dispatch(setStoryData(result.data[0]))
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {
        if(userName){
            handeStory()
        }
    }, [userName])
    
  return (
    <div className='w-full h-[100vh] bg-black flex justify-center items-center'>
      <StoryCard storyData={storyData} />
    </div>
  )
}

export default Story
