import React from 'react'
import OtherUsers from '../components/OtherUsers'
import { useSelector } from 'react-redux'
import { MdOutlineKeyboardBackspace } from 'react-icons/md'
import { useNavigate } from 'react-router-dom'

const SuggestedUsers = () => {

    const { suggestedUsers, following } = useSelector(state => state.user)
    console.log("suggestedUsers:", suggestedUsers)
    console.log("following:", following)

    const unFollowUsers = suggestedUsers?.filter(user =>
        !following.includes(user._id)
    )

    console.log("unFollowUsers:", unFollowUsers)

    const navigate = useNavigate()

    return (
        <div className='w-full flex bg-black min-h-screen flex-col gap-[20px]'>
            <div className='w-full h-[60px] flex items-center justify-between px-4 border-b border-gray-800  sticky top-0 z-10'>
                <div className='flex items-center gap-4'>
                    <MdOutlineKeyboardBackspace
                        className='text-white w-[24px] h-[24px] cursor-pointer hover:opacity-70 transition-opacity'
                        onClick={() => navigate('/')}
                    />
                    <h1 className='text-white text-[20px] font-semibold'>Suggested User</h1>
                </div>
            </div>
            <div className='w-full max-w-[700px] mx-auto px-4 overflow-auto'>
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

        </div>
    )
}

export default SuggestedUsers
