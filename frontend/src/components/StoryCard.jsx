import React, { useState, useEffect } from 'react'
import assets from '../assets/assets'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { MdOutlineKeyboardBackspace, MdClose } from 'react-icons/md'
import { BsThreeDotsVertical } from 'react-icons/bs'
import { IoMdHeart, IoMdHeartEmpty } from 'react-icons/io'
import VideoPlayer from './VideoPlayer'
import { FaEye } from 'react-icons/fa6'
import StoryVideoPlayer from './StoryVideoPlayer'
import { BiLoader } from 'react-icons/bi'
import { RiDeleteBin6Line } from 'react-icons/ri'
import { servalUrl } from '../App'
import axios from 'axios'
import { setAllStoriesData, setStoryData } from '../redux/storySlice'

const StoryCard = ({ storyData }) => {
    const [progress, setProgress] = useState(0)
    const [liked, setLiked] = useState(false)
    const [showViewers, setShowViewers] = useState(false)
    const [showOptions, setShowOptions] = useState(false)
    const [isPaused, setIsPaused] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const { userData } = useSelector(state => state.user)
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { socket } = useSelector(state => state.socket)
    const { allStoriesData } = useSelector(state => state.story)


    useEffect(() => {
        if (isPaused || showViewers) return
        const timer = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    navigate('/')
                    return prev
                }
                return prev + (100 / 150)
            })
        }, 100)
        return () => clearInterval(timer)
    }, [navigate, isPaused, showViewers, storyData?.mediaType])


    const handleLike = () => {
        setLiked(!liked)
        if (navigator.vibrate) {
            navigator.vibrate(50)
        }
    }


    // Delete post functionality
    const handleDeleteConfirm = async () => {
        setIsDeleting(true)

        try {
            const result = await axios.delete(`${servalUrl}/api/story/deleteStory/${storyData._id}`, { withCredentials: true })
            dispatch(setStoryData(null))
            setShowDeleteModal(false)
            navigate('/')
            // Show success message (you can replace with toast)
            // console.log('Post deleted successfully!')

        } catch (error) {
            // console.error('Error deleting story:', error)
            // alert(error.response?.data?.message || 'Failed to delete post. Please try again.')
        } finally {
            setIsDeleting(false)
        }
    }




    const handleDelete = () => {
        setShowDeleteModal(true)
    }

    const handleViewersToggle = (e) => {
        e.stopPropagation()
        setShowViewers(!showViewers)
        setIsPaused(prev => !prev)
    }

    const handleBackClick = () => {
        if (showViewers) {
            setShowViewers(false)
            setIsPaused(false)
        } else {
            navigate('/')
        }
    }




    return (
        <div className='w-full max-w-[500px] h-[100vh] border-x-2 border-gray-800 relative flex flex-col bg-black overflow-hidden'>

            {/* <div className='absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/50 z-10 pointer-events-none'></div> */}


            <div className='absolute top-0 left-0 right-0 h-1 bg-gray-700/50 z-30'>
                <div
                    className='h-full bg-white rounded-full transition-all duration-100 ease-linear'
                    style={{ width: `${progress}%` }}
                ></div>
            </div>


            <div className='flex items-center justify-between gap-[10px] absolute top-6 left-0 right-0 px-4 z-20'>
                <div className='flex items-center gap-3'>
                    <MdOutlineKeyboardBackspace
                        className='text-white w-[28px] h-[28px] cursor-pointer hover:scale-110 transition-transform drop-shadow-lg'
                        onClick={handleBackClick}
                    />
                    <div onClick={() => navigate(`/profile/${storyData?.author?.userName}`)} className='w-[40px] h-[40px] rounded-full border-2 border-white cursor-pointer overflow-hidden shadow-lg hover:scale-105 transition-transform'>
                        <img
                            className='w-full h-full object-cover'
                            src={storyData?.author?.profileImage || assets.avataricon}
                            alt=""
                        />
                    </div>
                    <div onClick={() => navigate(`/profile/${storyData?.author?.userName}`)} className='flex flex-col cursor-pointer'>
                        <div className='text-white font-semibold text-sm drop-shadow-md'>
                            {storyData?.author?.userName}
                        </div>
                    </div>
                </div>

                {storyData?.author?.userName === userData?.userName && <button
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className={`flex text-white items-center justify-center p-2 rounded-full transition-all duration-200 ${isDeleting
                        ? 'opacity-50 cursor-not-allowed'
                        : 'hover:text-red-600 cursor-pointer'
                        }`}
                    title="Delete Post"
                >
                    {isDeleting ? (
                        <BiLoader className='h-[25px] w-[25px] animate-spin' />
                    ) : (
                        <RiDeleteBin6Line className='h-[25px] w-[25px]' />
                    )}
                </button>}

                {/* <div className='relative'>
                    <BsThreeDotsVertical
                        className='text-white w-[24px] h-[24px] cursor-pointer hover:scale-110 transition-transform drop-shadow-lg'
                        onClick={() => setShowOptions(!showOptions)}
                    />
                </div> */}
            </div>

            {/* Story Content */}
            {!showViewers && (
                <>
                    <div className='flex-1 flex items-center justify-center relative z-10'>
                        {storyData?.mediaType === "image" && (
                            <div className='w-full h-full flex items-center justify-center p-4'>
                                <img
                                    className='max-w-full max-h-full object-contain rounded-xl shadow-2xl'
                                    src={storyData.media}
                                    alt=""
                                />
                            </div>
                        )}

                        {storyData?.mediaType === "video" && (
                            <div className='w-full h-full flex items-center justify-center'>
                                <div className='w-full max-w-[90%] rounded-xl overflow-hidden shadow-2xl'>
                                    <StoryVideoPlayer
                                        media={storyData.media}
                                        isPaused={isPaused}
                                        onProgress={(val) => setProgress(val)}
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Views Section - Only for story author */}
                    {storyData?.author?.userName === userData.userName && (
                        <div
                            className='absolute bottom-4 left-4 cursor-pointer z-20'
                            onClick={handleViewersToggle}
                        >
                            <div className='flex items-center gap-2 bg-black/50 backdrop-blur-sm px-3 py-2 '>
                                <FaEye className='text-white w-4 h-4' />
                                <span className='text-white text-sm font-semibold'>
                                    {storyData?.viewers?.length || 0}
                                </span>
                                <div className='flex relative'>
                                    {storyData?.viewers?.slice(0, 3).map((viewer, i) =>

                                        <div key={i} className={`w-[25px] h-[25px] md:w-[30px] md:h-[30px] rounded-full border-2 border-black cursor-pointer overflow-hidden `} style={{ position: i > 0 ? 'absolute' : 'relative', left: i > 0 ? `${i * 9}px` : 'auto', zIndex: 3 + i }}>
                                            <img className='w-full h-full object-cover' src={viewer?.profileImage || assets.avataricon} alt="" />
                                            {/* {console.log(user)} */}
                                        </div>
                                    )}

                                </div>

                                {storyData?.viewers?.length > 3 && (
                                    <span className='text-white text-xs'>
                                        +{storyData.viewers.length - 3}
                                    </span>
                                )}
                            </div>
                        </div>
                    )}
                </>
            )}

            {/* Viewers List Modal */}
            {showViewers && (
                <>
                    <div onClick={handleViewersToggle} className='flex-1 flex items-center justify-center h-[30%]'>
                        <div className='w-full max-w-[200px] max-h-[200px] aspect-[9/16] rounded-2xl overflow-hidden shadow-2xl bg-gray-900'>
                            {storyData?.mediaType === "image" && (
                                <img
                                    className='w-full h-full object-cover'
                                    src={storyData.media}
                                    alt=""
                                />
                            )}
                            {storyData?.mediaType === "video" && (
                                <div className='w-full h-full aspect-auto'>
                                    <StoryVideoPlayer
                                        media={storyData.media}
                                        isPaused={isPaused}
                                        onProgress={(val) => setProgress(val)}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                    <div className='h-[60%] bg-black z-30 flex flex-col'>
                        <div className='flex-1 bg-gray-900/50 backdrop-blur-sm border-t border-white/10 rounded-t-3xl'>
                            {/* Viewers Header */}
                            <div className='p-4 border-b border-white/10'>
                                <div className='flex items-center gap-3'>
                                    <FaEye className='text-white w-5 h-5' />
                                    <span className='text-white text-[14px] sm:text-lg font-semibold'>
                                        {storyData?.viewers?.length || 0} viewers
                                    </span>
                                </div>
                            </div>

                            {/* Viewers List */}
                            <div className='flex-1 overflow-auto'>
                                <div className='p-2'>
                                    {storyData?.viewers?.map((viewer, i) => (
                                        <div key={i} className='flex items-center gap-3 hover:bg-white/5 p-3 rounded-xl transition-colors cursor-pointer'>
                                            <div onClick={() => navigate(`/profile/${viewer?.userName}`)}
                                                className='w-[40px] h-[40px] rounded-full overflow-hidden border border-white/20 cursor-pointer'>
                                                <img
                                                    className='w-full h-full object-cover'
                                                    src={viewer?.profileImage || assets.avataricon}
                                                    alt=""
                                                />
                                            </div>
                                            <div className='flex-1'>
                                                <div onClick={() => navigate(`/profile/${viewer?.userName}`)} className='text-white font-medium text-sm'>
                                                    {viewer?.userName}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}

            {/* Touch Areas for Navigation */}
            {/* {!showViewers &&
                <div className='absolute inset-0 flex z-15'>
                    <div
                        className='w-1/3 h-full cursor-pointer'
                        onClick={() => {
                            if (!showViewers) {
                                setProgress(0)
                            }
                        }}
                    ></div>

                    <div
                        className='w-1/3 h-full cursor-pointer'
                        onClick={() => {
                            if (!showViewers) {
                                setIsPaused(!isPaused)
                            }
                        }}
                    ></div>

                    <div
                        className='w-1/3 h-full cursor-pointer'
                        onClick={() => {
                            if (!showViewers) {
                                navigate('/')
                            }
                        }}
                    ></div>
                </div>
            } */}



            {/* Loading State */}
            {!storyData && (
                <div className='absolute inset-0 bg-black flex items-center justify-center z-50'>
                    <div className='w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin'></div>
                </div>
            )}



            {showDeleteModal && (
                <>
                    <div className='fixed inset-0 bg-black/50 z-[90] transition-opacity duration-300'></div>
                    <div
                        // ref={deleteModalRef}
                        className='fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl w-[90%] max-w-[400px] z-[100] shadow-2xl animate-scale-in'
                    >
                        <div className='p-6'>
                            <div className='text-center mb-6'>
                                <div className='w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                                    <RiDeleteBin6Line className='w-8 h-8 text-red-600' />
                                </div>
                                <h3 className='text-xl font-bold text-gray-900 mb-2'>
                                    Delete Story?
                                </h3>
                                <p className='text-gray-600'>
                                    This action cannot be undone. Your story will be permanently deleted.
                                </p>
                            </div>

                            <div className='flex gap-3'>
                                <button
                                    onClick={() => setShowDeleteModal(false)}
                                    disabled={isDeleting}
                                    className='flex-1 px-4 py-3 bg-gray-200 text-gray-800 rounded-xl font-semibold hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleDeleteConfirm}
                                    disabled={isDeleting}
                                    className='flex-1 px-4 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2'
                                >
                                    {isDeleting ? (
                                        <>
                                            <BiLoader className='w-4 h-4 animate-spin' />
                                            Deleting...
                                        </>
                                    ) : (
                                        'Delete'
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            )}

        </div>
    )
}

export default StoryCard
