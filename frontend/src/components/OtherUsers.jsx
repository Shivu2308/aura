import React from 'react'
import { useSelector } from 'react-redux'
import assets from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import FollowBtn from './FollowBtn'

const OtherUsers = ({ user }) => {
  // const { userData } = useSelector(state => state.user)
  const navigate = useNavigate()
  return (
    <div className='w-full h-[80px] flex items-center justify-between border-b-2 border-gray-800'>
      <div onClick={() => navigate(`/profile/${user.userName}`)}
       className='flex items-center gap-[10px] cursor-pointer'>
        <div  className='w-[50px] h-[50px] rounded-full shrink-0 cursor-pointer overflow-hidden'>
          <img className='w-full h-full object-cover' src={user.profileImage || assets.avataricon} alt="" />
        </div>
        <div>
          <div className='text-[18px] text-white font-semibold'>{user.userName}</div>
          <div className='text-[15px] text-gray-400 font-semibold'>{user.name}</div>
        </div>
      </div>
      <FollowBtn targetUserId={user._id} tailwind={'px-[10px] w-[100px] py-[5px] h-[40px] bg-white rounded-2xl cursor-pointer'} />
    </div>
  )
}

export default OtherUsers
