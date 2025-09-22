import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { servalUrl } from '../App'
import { useEffect } from 'react'
import { setFollowing } from '../redux/userSlice'
import axios from 'axios'

const getFollowingList = () => {
     const dispatch = useDispatch()

    const { storyData } = useSelector(state => state.story)
    useEffect(() => {
        const fetchUser = async () =>{
            try {
                const result = await axios.get(`${servalUrl}/api/user/followingList`,{withCredentials:true})
                // console.log(result.data)
                dispatch(setFollowing(result.data))
            } catch (error) {
                // console.log(error)
            }
        }

        fetchUser()
    }, [storyData])
//   return ([])
}

export default getFollowingList
