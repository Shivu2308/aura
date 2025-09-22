import React, { useEffect } from 'react'
import { setPostData } from '../redux/postSlice'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { servalUrl } from '../App'

const getAllPosts = () => {
  const { userData } = useSelector(state => state.user)
  const dispatch = useDispatch()
    useEffect(() => {
        const fetchPost = async () =>{
            try {
                const result = await axios.get(`${servalUrl}/api/post/getAllPosts`,{withCredentials:true})
                // console.log(result.data)
                dispatch(setPostData(result.data))
            } catch (error) {
                // console.log(error)
            }
        }

        fetchPost()
    }, [dispatch, userData])
    
//   return ([])
}

export default getAllPosts;
