import React from 'react'
import assets from '../assets/assets'
import { FaRegHeart } from "react-icons/fa6";
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { servalUrl } from '../App';
import { setUserData } from '../redux/userSlice';
import OtherUsers from './OtherUsers';
import { useState } from 'react';
import Notifications from '../pages/Notifications';

const LeftHome = () => {
  const [showNotification, setShowNotification] = useState(false)
  const { userData, following,  suggestedUsers, notificationsData } = useSelector(state => state.user)
  const dispatch = useDispatch()

  const handleLogout = async () => {
    try {
      const result = await axios.get(`${servalUrl}/api/auth/signout`, { withCredentials: true })
      dispatch(setUserData(null))
    } catch (error) {
      console.log(error)
    }
  }

  console.log(suggestedUsers)

   const unFollowUsers = suggestedUsers?.filter(user =>
        !following.includes(user._id)
    )




  return (
    <div className={`w-[25%] hidden lg:block h-[100vh] bg-[black] border-r-2 border-gray-900 ${showNotification ? 'overflow-hidden' : 'overflow-auto'}`}>
      <div className='w-full h-[100px] flex items-center justify-between p-[20px]'>
        <div className='flex items-center justify-center'>
          <img src={assets.appfavicon} alt="" className='w-[40px]' />
          <img src={assets.auralogowords} alt="" className='w-[80px]' />
        </div>
        <div className='relative cursor-pointer' onClick={() => setShowNotification(prev => !prev)}>
          <FaRegHeart className='text-white w-[25px] h-[25px]' />
          {
            (notificationsData?.length > 0 && notificationsData.some(noti => noti.isRead === false)) &&
            <div className='w-[10px] h-[10px] bg-blue-600 rounded-full absolute top-0 -right-1'></div>
          }
        </div>
      </div>




      {showNotification ? <Notifications /> : <>


        <div className={`flex items-center justify-between px-[10px] w-full gap-[10px] border-b-2 border-b-gray-900 py-[10px] `}>
          <div className='flex items-center gap-[10px]'>
            <div className='w-[70px] h-[70px] rounded-full border-2 border-black cursor-pointer overflow-hidden'>
              <img className='w-full h-full object-cover' src={userData?.profileImage || assets.avataricon} alt="" />
            </div>
            <div>
              <div className='text-[18px] text-white font-semibold'>{userData.userName}</div>
              <div className='text-[15px] text-gray-400 font-semibold'>{userData.name}</div>
            </div>
          </div>
          
          <div onClick={handleLogout}
            className='text-blue-500 font-semibold cursor-pointer'>
            Log Out
          </div>
        </div>


        <div className='w-full flex flex-col gap-[20px] p-5'>
          <h1 className='text-white text-[18px]'>Suggested User</h1>
          {unFollowUsers && unFollowUsers.length > 0 ? (
                    unFollowUsers.map((user) => (
                        <OtherUsers key={user?._id} user={user} />
                    ))
                ) : (
                    <div className="text-center py-12">
                        <div className="mb-6">
                            <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                            </div>
                        </div>

                        <h3 className="text-xl font-semibold text-gray-800 mb-2">
                            No Suggestions Available
                        </h3>

                        <p className="text-gray-500 text-sm mb-6 max-w-xs mx-auto leading-relaxed">
                            We'll suggest new people when we find accounts you might be interested in.
                        </p>
                    </div>
                )}

        </div>

      </>}

    </div>
  )
}

export default LeftHome
