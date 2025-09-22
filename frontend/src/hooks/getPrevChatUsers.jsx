import axios from 'axios'
import React from 'react'
import { servalUrl } from '../App'
import { useEffect } from 'react'
import { setPrevChatUsers } from '../redux/messageSlice'
import { useDispatch, useSelector } from 'react-redux'

const getPrevChatUsers = () => {
         const dispatch = useDispatch()
    
        const { messages } = useSelector(state => state.message)
        useEffect(() => {
            const fetchPrevChatUsers = async () =>{
                try {
                    const result = await axios.get(`${servalUrl}/api/message/prevChats`,{withCredentials:true})
                    // console.log(result.data)
                    dispatch(setPrevChatUsers(result.data))
                } catch (error) {
                    // console.log(error)
                }
            }
    
            fetchPrevChatUsers()
        }, [messages])
//   return ([])
}

export default getPrevChatUsers
