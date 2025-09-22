import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { servalUrl } from '../App'
import axios from 'axios'
import { toggleFollowing } from '../redux/userSlice'

const FollowBtn = ({targetUserId, tailwind}) => {
    const { following } = useSelector(state => state.user)
    const isFollowing = following?.includes(targetUserId)
    const dispatch = useDispatch()
    const handleFollow = async () => {
        try {
            const result = await axios.get(`${servalUrl}/api/user/follow/${targetUserId}`,{withCredentials:true})
            dispatch(toggleFollowing(targetUserId))
        } catch (error) {
            // console.log(error)
        }
    }
  return (
    <button onClick={handleFollow} className={tailwind}>{ isFollowing ? "Unfollow" : "Follow" }</button>
  )
}

export default FollowBtn
