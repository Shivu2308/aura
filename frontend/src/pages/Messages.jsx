import React from 'react'
import { useNavigate } from 'react-router-dom'
import { MdOutlineKeyboardBackspace } from "react-icons/md";
import { useDispatch, useSelector } from 'react-redux';
import OnlineUsers from '../components/OnlineUsers';
import { setSelectedUser } from '../redux/messageSlice';
import assets from '../assets/assets';

const Messages = () => {
  const { userData } = useSelector(state => state.user)
  const { onlineUsers } = useSelector(state => state.socket)
  const { prevChatUsers } = useSelector(state => state.message)
  // console.log(prevChatUsers)
  const myOnlineList = userData?.following?.some(user => onlineUsers?.includes(user._id))
  const dispatch = useDispatch()
  const navigate = useNavigate()
  // const handleClick = () => {
  //   dispatch(setSelectedUser(user))
  //   navigate(`/messageArea`)
  // }
  return (
  <div className='w-full min-h-screen bg-black flex flex-col'>
    {/* Header */}
    <div className='w-full h-[60px] flex items-center justify-between px-4 border-b border-gray-800 bg-black sticky top-0 z-10'>
      <div className='flex items-center gap-4'>
        <MdOutlineKeyboardBackspace
          className='text-white w-[24px] h-[24px] cursor-pointer hover:opacity-70 transition-opacity'
          onClick={() => navigate('/')}
        />
        <h1 className='text-white text-[20px] font-semibold'>Messages</h1>
      </div>
    </div>

    {/* Online Users Section */}
    {myOnlineList && (
      <div className='w-full bg-black border-b border-gray-800'>
        <div className='w-full max-w-[800px] mx-auto px-4 py-4'>
          <div className='flex gap-4 overflow-x-auto scrollbar-hide'>
            {userData?.following?.map((user) => (
              onlineUsers?.includes(user._id) && (
                <div key={user._id} className='flex-shrink-0'>
                  <OnlineUsers user={user} />
                </div>
              )
            ))}
          </div>
        </div>
      </div>
    )}

    {/* Chat List */}
    <div className='flex-1 w-full max-w-[800px] mx-auto overflow-y-auto'>
      {prevChatUsers?.length > 0 ? (
        <div className='divide-y divide-gray-800'>
          {prevChatUsers.map((user) => (
            <div 
              key={user?._id} 
              className='group w-full flex items-center gap-4 p-4 hover:bg-gray-900/50 active:bg-gray-800/50 cursor-pointer transition-colors duration-150'
              onClick={() => {
                dispatch(setSelectedUser(user))
                navigate('/messageArea')
              }}
            >
              {/* Avatar with Online Status */}
              <div className='relative flex-shrink-0'>
                {onlineUsers?.includes(user?._id) ? (
                  <OnlineUsers user={user} />
                ) : (
                  <div className='w-[56px] h-[56px] rounded-full overflow-hidden ring-2 ring-gray-700'>
                    <img 
                      className='w-full h-full object-cover' 
                      src={user?.profileImage || assets.avataricon} 
                      alt={user?.userName || 'User'}
                      onError={(e) => {
                        e.target.src = assets.avataricon
                      }}
                    />
                  </div>
                )}
              </div>

              {/* User Info */}
              <div className='flex-1 min-w-0'>
                <div className='flex items-center justify-between mb-1'>
                  <h3 className='text-white text-[16px] font-semibold truncate'>
                    {user?.userName}
                  </h3>
                </div>
                
                <div className='flex items-center justify-between'>
                  <div className='flex flex-col'>
                    {onlineUsers?.includes(user?._id) && (
                      <span className='text-green-500 text-[12px] font-medium mt-1'>
                        Active now
                      </span>
                    )}
                  </div>
                  
                  {/* Unread Badge - you can add unread count */}
                  {user?.unreadCount > 0 && (
                    <div className='w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center ml-2 flex-shrink-0'>
                      <span className='text-white text-[10px] font-bold'>
                        {user.unreadCount > 9 ? '9+' : user.unreadCount}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Chevron Icon */}
              <div className='text-gray-600 group-hover:text-gray-400 transition-colors'>
                <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 20 20'>
                  <path fillRule='evenodd' d='M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z' clipRule='evenodd' />
                </svg>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className='flex flex-col items-center justify-center h-full min-h-[400px] px-8 text-center'>
          <div className='w-24 h-24 rounded-full bg-gray-800 flex items-center justify-center mb-6'>
            <svg className='w-10 h-10 text-gray-400' fill='currentColor' viewBox='0 0 24 24'>
              <path d='M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2M21 9V7L15 1H5C3.89 1 3 1.89 3 3V18C3 19.1 3.9 20 5 20H11V18H5V3H13V9H21Z'/>
            </svg>
          </div>
          <h2 className='text-white text-[20px] font-semibold mb-2'>
            Your Messages
          </h2>
          <p className='text-gray-400 text-[14px] mb-6 max-w-[280px]'>
            Send private photos and messages to a friend or group
          </p>
        </div>
      )}
    </div>
  </div>
)
}

export default Messages
