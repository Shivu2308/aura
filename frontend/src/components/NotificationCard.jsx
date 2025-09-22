import React from 'react'
import assets from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import FollowBtn from './FollowBtn'

const NotificationCard = ({ noti }) => {
    const { following } = useSelector(state => state.user)
    const isFollowing = following.includes(noti?.sender?._id);

    const navigate = useNavigate()
    const getTimeAgo = (createdAt) => {
    if (!createdAt) return 'now'
    
    const now = new Date()
    const created = new Date(createdAt)
    const diffInMs = now - created
    const diffInSeconds = Math.floor(diffInMs / 1000)
    const diffInMinutes = Math.floor(diffInSeconds / 60)
    const diffInHours = Math.floor(diffInMinutes / 60)
    const diffInDays = Math.floor(diffInHours / 24)
    const diffInWeeks = Math.floor(diffInDays / 7)
    const diffInMonths = Math.floor(diffInDays / 30)
    const diffInYears = Math.floor(diffInDays / 365)
    
    if (diffInSeconds < 60) {
        return 'now'
    } else if (diffInMinutes < 60) {
        return `${diffInMinutes}m`
    } else if (diffInHours < 24) {
        return `${diffInHours}h`
    } else if (diffInDays < 7) {
        return `${diffInDays}d`
    } else if (diffInWeeks < 4) {
        return `${diffInWeeks}w`
    } else if (diffInMonths < 12) {
        return `${diffInMonths}mo`
    } else {
        return `${diffInYears}y`
    }
}

    return (
        <div className='w-full flex items-center gap-3 p-3 hover:bg-gray-900 transition-colors duration-200 cursor-pointer '>
            {/* Profile Image with Story Ring */}
            <div className='relative flex-shrink-0'>
                <div onClick={() => navigate(`/profile/${noti?.sender?.userName}`)} 
                 className='w-12 h-12 rounded-full overflow-hidden border-2 border-gray-200 hover:border-blue-400 transition-colors'>
                    <img
                        className='w-full h-full object-cover'
                        src={noti?.sender?.profileImage || assets.avataricon}
                        alt={`${noti?.sender?.userName}'s avatar`}
                    />
                </div>
                {/* Notification Type Indicator */}
                <div className='absolute -bottom-1 -right-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center border-2 border-white shadow-lg'>
                    {/* Icon based on notification type */}
                    {noti?.type === 'like' && (
                        <svg className='w-3 h-3 text-white' fill='currentColor' viewBox='0 0 20 20'>
                            <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                        </svg>
                    )}
                    {noti?.type === 'comment' && (
                        <svg className='w-3 h-3 text-white' fill='currentColor' viewBox='0 0 20 20'>
                            <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                        </svg>
                    )}
                    {noti?.type === 'follow' && (
                        <svg className='w-3 h-3 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                    )}
                    {(!noti?.type || noti?.type === 'general') && (
                        <svg className='w-3 h-3 text-white' fill='currentColor' viewBox='0 0 20 20'>
                            <path d="M10 2L3 7v11c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V7l-7-5z" />
                        </svg>
                    )}
                </div>
            </div>

            {/* Notification Content */}
            <div className='flex-1 min-w-0 pr-2'>
                <div className='flex items-start justify-between'>
                    <div className='flex-1 min-w-0'>
                        <p className='text-sm text-white'>
                            <span onClick={() => navigate(`/profile/${noti?.sender?.userName}`)} className='font-semibold hover:text-blue-600 transition-colors cursor-pointer'>
                                {noti?.sender?.userName}
                            </span>
                            <span className='text-gray-200 ml-1'>
                                {noti?.message}
                            </span>
                            <span className='text-gray-400 ml-1'>
                            {getTimeAgo(noti?.createdAt)}
                        </span>
                        </p>
                       
                    </div>

                    {/* Post Thumbnail (if applicable) */}
                    {noti?.post?.media && (
                        <div className='w-11 h-11 ml-3 flex-shrink-0'>
                            <div className='w-full h-full rounded-lg overflow-hidden border border-gray-200'>
                                {noti.post.mediaType === 'image' ? (
                                    <img
                                        className='w-full h-full object-cover'
                                        src={noti.post.media}
                                        alt="Post thumbnail"
                                    />
                                ) : (
                                    <div className='w-full h-full bg-black flex items-center justify-center'>
                                        <video className='h-full w-full' muted src={noti?.post?.media}></video>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {noti?.vibe?.media && (
                        <div className='w-11 h-11 bg-black flex items-center justify-center'>
                            <video className='h-full w-full' muted loop src={noti?.vibe?.media}></video>
                        </div>
                    )}
                </div>
            </div>

            {/* Unread Indicator */}
            {!noti?.isRead && (
                <div className='w-2 h-2 bg-blue-500 rounded-full flex-shrink-0'></div>
            )}

            {/* Follow Button (if it's a follow notification) */}
            {noti?.type === 'follow' && (
                <FollowBtn targetUserId = {noti?.sender?._id} tailwind = {'px-4 py-1.5 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-lg transition-colors duration-200 cursor-pointer'} />
                // <button className='px-4 py-1.5 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-lg transition-colors duration-200 cursor-pointer'>
                //     { isFollowing ? "Following" : "Follow Back" }
                // </button>
            )}
        </div>
    )
}

export default NotificationCard
