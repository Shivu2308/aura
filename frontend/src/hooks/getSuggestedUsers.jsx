import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setSuggestedUsers } from '../redux/userSlice'
import { useEffect } from 'react'
import axios from 'axios'
import { servalUrl } from '../App'

const getSuggestedUsers = () => {
    const {userData} = useSelector(state => state.user)
     const dispatch = useDispatch()
    useEffect(() => {
        const fetchUser = async () =>{
            try {
                const result = await axios.get(`${servalUrl}/api/user/suggested`,{withCredentials:true})
                dispatch(setSuggestedUsers(result.data))
            } catch (error) {
                // console.log(error)
            }
        }

        fetchUser()
    }, [userData])
    
  return ([])
}

export default getSuggestedUsers
