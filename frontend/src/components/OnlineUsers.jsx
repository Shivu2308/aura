import React from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { setSelectedUser } from '../redux/messageSlice'
import assets from '../assets/assets'

const OnlineUsers = ({user}) => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    
    const handleClick = () => {
        dispatch(setSelectedUser(user))
        navigate(`/messageArea`)
    }
    return ( 
        <div className='w-[50px] h-[50px] flex gap-[20px] justify-start items-center relative'>
            <div onClick={handleClick}
                className='flex items-center gap-[10px] cursor-pointer'>
                <div className='w-[50px] h-[50px] rounded-full shrink-0 cursor-pointer overflow-hidden'>
                    <img className='w-full h-full object-cover' src={user?.profileImage || assets.avataricon} alt="" />
                </div>
            </div>
            <div className='w-[10px] h-[10px] rounded-full bg-[#0080ff] absolute top-0 right-0'></div>
        </div>
    )
}

export default OnlineUsers
