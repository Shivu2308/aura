import React from 'react'
import { MdOutlineKeyboardBackspace } from 'react-icons/md'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import OtherUsers from '../components/OtherUsers'

const Followers = () => {
  const navigate = useNavigate()
  const { profileData } = useSelector(state => state.user)
//   console.log(profileData)
  return (
    <div className='w-full min-h-screen bg-black flex items-center flex-col gap-5 relative'>
      <div className='w-full h-[80px] flex items-center gap-[20px] px-[20px]'>
        <MdOutlineKeyboardBackspace
          className='text-white w-[25px] h-[25px] cursor-pointer'
          onClick={() => navigate(`/profile/${profileData.userName}`)}
        />
        <h1 className='text-white text-[20px] font-semibold'>Following</h1>
      </div>

      <div className='w-full max-w-[700px] mx-auto px-4 overflow-auto'>
        {
          profileData?.followers?.map((user) => (
            <OtherUsers key={user?._id} user={user} />
          ))
        }
      </div>
    </div>
  )
}

export default Followers
