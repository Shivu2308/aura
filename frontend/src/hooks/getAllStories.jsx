import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { servalUrl } from '../App'
import axios from 'axios'
import { setAllStoriesData } from '../redux/storySlice'

const getAllStories = () => {
     const { userData } = useSelector(state => state.user)
     const { storyData } = useSelector(state => state.story)
  const dispatch = useDispatch()
    useEffect(() => {
        const fetchAllStories = async () =>{
            try {
                const result = await axios.get(`${servalUrl}/api/story/getallStories`,{withCredentials:true})
                dispatch(setAllStoriesData(result.data))
            } catch (error) {
                // console.log(error)
            }
        }

        fetchAllStories()
    }, [userData, storyData])
//   return ([])
}

export default getAllStories
