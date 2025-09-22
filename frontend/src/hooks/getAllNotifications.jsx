import React from 'react'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { servalUrl } from '../App'
import axios from 'axios'
import { setNotificationsData } from '../redux/userSlice'

const getAllNotifications = () => {
    const { userData } = useSelector(state => state.user)
    const { vibeData } = useSelector(state => state.vibe)
  const dispatch = useDispatch()
    useEffect(() => {
        const fetchNotifications = async () =>{
            try {
                const result = await axios.get(`${servalUrl}/api/user/getAllNotification`,{withCredentials:true})
                // console.log(result.data)
                dispatch(setNotificationsData(result.data))
            } catch (error) {
                // console.log(error)
            }
        }

        fetchNotifications()
    }, [dispatch, userData, vibeData])

//   return ([])
}

export default getAllNotifications
