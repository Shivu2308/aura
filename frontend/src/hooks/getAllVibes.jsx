import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setVibeData } from '../redux/vibeSlice'
import axios from 'axios'
import { servalUrl } from '../App'

const getAllVibes = () => {

     const { userData } = useSelector(state => state.user)
  const dispatch = useDispatch()
    useEffect(() => {
        const fetchVibes = async () =>{
            try {
                const result = await axios.get(`${servalUrl}/api/vibe/getAllVibes`,{withCredentials:true})
                // console.log(result.data)
                dispatch(setVibeData(result.data))
            } catch (error) {
                // console.log(error)
            }
        }

        fetchVibes()
    }, [dispatch, userData])
    
//   return ([] )
}

export default getAllVibes
