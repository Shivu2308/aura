import React, { useEffect, useRef, useState } from 'react'
import { FiVolume2, FiVolumeX } from 'react-icons/fi'
import FollowBtn from './FollowBtn'
import { useNavigate } from 'react-router-dom'
import { GoHeart, GoHeartFill } from 'react-icons/go'
import { useDispatch, useSelector } from 'react-redux'
import { MdOutlineModeComment } from 'react-icons/md'
import { setVibeData } from '../redux/vibeSlice'
import axios from 'axios'
import { servalUrl } from '../App'
import assets from '../assets/assets'
import { IoSend } from 'react-icons/io5'
import { RiDeleteBin6Line } from 'react-icons/ri'
import { BiLoader } from 'react-icons/bi'

const VibeCard = ({ vibe }) => {
    const videoRef = useRef()
    const commentRef = useRef()
    const clickTimeoutRef = useRef(null) // Click timer reference

    const [isPlaying, setIsPlaying] = useState(true)
    const [isMute, setIsMute] = useState(false)
    const [progress, setProgress] = useState(0)
    const [showHeart, setShowHeart] = useState(false)
    const [showComments, setShowComments] = useState(false)
    const [message, setMessage] = useState('')
    const [isDeleting, setIsDeleting] = useState(false)
    const [showDeleteModal, setShowDeleteModal] = useState(false)

    const navigate = useNavigate()
    const { userData } = useSelector(state => state.user)
    const { vibeData } = useSelector(state => state.vibe)
    const { socket } = useSelector(state => state.socket)

    const dispatch = useDispatch()

    // Single click handler with delay
    const handleSingleClick = () => {
        if (isPlaying) {
            videoRef.current.pause()
            setIsPlaying(false)
        } else {
            videoRef.current.play()
            setIsPlaying(true)
        }
    }

    // Click handler with double-click detection
    const handleVideoClick = () => {
        if (clickTimeoutRef.current) {
            // Double click detected - clear single click timer
            clearTimeout(clickTimeoutRef.current)
            clickTimeoutRef.current = null
            handleLikeOnDoubleClick()
        } else {
            // Single click - set timer for delayed execution
            clickTimeoutRef.current = setTimeout(() => {
                handleSingleClick()
                clickTimeoutRef.current = null
            }, 300) // 300ms delay to detect double click
        }
    }

    const handleTimeUpdate = () => {
        const video = videoRef.current
        if (video) {
            const percent = (video.currentTime / video.duration) * 100
            setProgress(percent)
        }
    }

    const handleMuteToggle = () => {
        const video = videoRef.current
        if (video) {
            video.muted = !video.muted
            setIsMute(!isMute)
        }
    }

    const handleCommentsToggle = () => {
        setShowComments(prev => !prev)
    }

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                const video = videoRef.current
                if (!video) return

                if (entry.isIntersecting) {
                    video.play()
                        .then(() => {
                            setIsPlaying(true)
                        })
                        .catch((error) => {
                            // console.log('Autoplay failed:', error)
                        })
                } else {
                    video.pause()
                    setIsPlaying(false)
                }
            })
        }, {
            threshold: 0.6,
            rootMargin: '0px'
        })

        const timer = setTimeout(() => {
            if (videoRef.current) {
                observer.observe(videoRef.current)
            }
        }, 100)

        return () => {
            clearTimeout(timer)
            if (videoRef.current) {
                observer.unobserve(videoRef.current)
            }
            // Cleanup click timer on unmount
            if (clickTimeoutRef.current) {
                clearTimeout(clickTimeoutRef.current)
            }
        }
    }, [])

    const handleLike = async () => {
        try {
            const result = await axios.get(`${servalUrl}/api/vibe/like/${vibe._id}`, { withCredentials: true })
            const updatedVibe = result.data
            const updatedVibes = vibeData.map(p => p._id === vibe._id ? updatedVibe : p)
            dispatch(setVibeData(updatedVibes))
        } catch (error) {
            // console.log(error)
        }
    }

    const handleComment = async () => {
        try {
            const result = await axios.post(`${servalUrl}/api/vibe/comment/${vibe._id}`, { message }, { withCredentials: true })
            const updatedVibe = result.data
            const updatedVibes = vibeData.map(p => p._id === vibe._id ? updatedVibe : p)
            dispatch(setVibeData(updatedVibes))
            setMessage("")
        } catch (error) {
            // console.log(error)
        }
    }

    const handleLikeOnDoubleClick = () => {
        setShowHeart(true)
        setTimeout(() => {
            setShowHeart(false)
        }, 2000)

        if (!vibe.likes.includes(userData._id)) {
            handleLike()
        }
    }

    const handleDeleteVibe = () => {
        setShowDeleteModal(true)
    }

    const handleDeleteConfirm = async () => {
        setIsDeleting(true)
        try {
            const result = await axios.delete(`${servalUrl}/api/vibe/deleteVibe/${vibe._id}`, { withCredentials: true })
            const updatedVibes = vibeData.filter(vibeItem => vibeItem._id !== vibe._id)
            dispatch(setVibeData(updatedVibes))

            setShowDeleteModal(false)
        } catch (error) {
            // console.error('Error deleting vibe:', error)
            // Handle error - maybe show toast notification
        } finally {
            setIsDeleting(false)
        }
    }



    useEffect(() => {
        const handleClickOutSide = (e) => {
            if (commentRef.current && !commentRef.current.contains(e.target)) {
                setShowComments(false)
            }
        }

        if (showComments) {
            document.addEventListener('mousedown', handleClickOutSide)
        } else {
            document.removeEventListener('mousedown', handleClickOutSide)
        }
    }, [showComments])

    useEffect(() => {
        socket.on("likedOnVibe", (updatedData) => {
            const updatedVibes = vibeData.map(p => p._id === updatedData.vibeId ? { ...p, likes: updatedData.likes } : p)
            dispatch(setVibeData(updatedVibes))
        })

        socket.on("commentedOnVibe", (updatedData) => {
            const updatedVibes = vibeData.map(p => p._id === updatedData.vibeId ? { ...p, comments: updatedData.comments } : p)
            dispatch(setVibeData(updatedVibes))
        })

        socket.on("vibeDeleted", ({ vibeId, authorId }) => {
            const updatedVibes = vibeData.filter(vibeItem => vibeItem._id !== vibeId)
            dispatch(setVibeData(updatedVibes))
        })

        return () => {
            socket?.off("likedOnVibe")
            socket?.off("commentedOnVibe")
            socket?.off("vibeDeleted")
        }
    }, [socket, vibeData, dispatch])


    return (
        <div className='w-full lg:w-[480px] h-[100vh] flex items-center justify-center border-l-2 border-r-2 border-gray-800 relative'>
            <video
                onClick={handleVideoClick}
                onTimeUpdate={handleTimeUpdate}
                ref={videoRef}
                loop
                muted={isMute}
                playsInline
                preload="metadata"
                src={vibe?.media}
                className='w-full max-h-[100vh] object-cover'
            />

            <div className='absolute bottom-0 left-0 w-full h-[3px] bg-gray-900'>
                <div className='h-[100%] bg-white transition-all duration-300 ease-linear' style={{ width: `${progress}%` }}></div>
            </div>

            <div className='w-full absolute h-[100px] bottom-[10px] px-[10px] flex flex-col gap-[10px]'>
                <div onClick={() => navigate(`/profile/${vibe?.author?.userName}`)}
                    className='flex justify-start items-center gap-[10px] md:gap-5 cursor-pointer '>
                    <div className='w-[30px] h-[30px] md:w-[50px] md:h-[50px] rounded-full border-2 border-black cursor-pointer overflow-hidden'>
                        <img className='w-full h-full object-cover' src={vibe?.author?.profileImage || assets.avataricon} alt="" />
                    </div>
                    <div className='max-w-[150px] text-[16px] font-semibold text-white truncate'>{vibe?.author?.userName}</div>

                    {userData._id !== vibe.author._id ? (
                        <FollowBtn targetUserId={vibe.author._id} tailwind={'px-[10px] py-[4px] text-[14px] text-white border-1 border-white rounded-xl'} />
                    ) : (
                        <button
                            onClick={(e) => {
                                e.stopPropagation()
                                handleDeleteVibe()
                            }}
                            disabled={isDeleting}
                            className={`flex items-center justify-center gap-2 px-[10px] py-[4px] text-[14px] rounded-xl border transition-all duration-200 ${isDeleting
                                    ? 'opacity-50 cursor-not-allowed bg-gray-700 border-gray-600 text-gray-400'
                                    : 'text-white border-red-500 hover:bg-red-500 hover:text-white bg-transparent'
                                }`}
                            title="Delete Vibe"
                        >
                            {isDeleting ? (
                                <>
                                    <BiLoader className='w-3 h-3 animate-spin' />
                                    Deleting...
                                </>
                            ) : (
                                <>
                                    <RiDeleteBin6Line className='w-3 h-3' />
                                    Delete
                                </>
                            )}
                        </button>
                    )}
                </div>
                <div className='text-white px-[10px]'>
                    {vibe?.caption}
                </div>
            </div>

            <div className='absolute right-0 flex flex-col gap-[20px] text-white bottom-[150px] justify-center px-[10px]'>
                <div className='flex flex-col items-center justify-center cursor-pointer'>
                    <div>
                        {vibe.likes.includes(userData._id) ? (
                            <GoHeartFill className='w-[25px] h-[25px] cursor-pointer font-bold text-red-600' onClick={handleLike} />
                        ) : (
                            <GoHeart className='w-[25px] h-[25px] font-bold cursor-pointer' onClick={handleLike} />
                        )}
                    </div>
                    <div>{vibe?.likes?.length}</div>
                </div>

                <div className='flex flex-col items-center justify-center cursor-pointer'>
                    <div>
                        <MdOutlineModeComment className='w-[25px] h-[25px] cursor-pointer' onClick={handleCommentsToggle} />
                    </div>
                    <div>{vibe?.comments?.length}</div>
                </div>
                <div className='flex flex-col items-center justify-center cursor-pointer' onClick={handleMuteToggle}>
                    {isMute ?
                        <FiVolumeX className='w-[20px] h-[20px] text-white font-semibold cursor-pointer' /> :
                        <FiVolume2 className='w-[20px] h-[20px] text-white font-semibold cursor-pointer' />
                    }
                </div>
            </div>

            {showHeart && (
                <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 heart-animation z-50'>
                    <GoHeartFill className='w-[80px] h-[80px] font-bold text-white drop-shadow-2xl' />
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <>
                    <div className='fixed inset-0 bg-black/70 z-[90] transition-opacity duration-300'></div>
                    <div className='fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#0e1718] border border-gray-700 rounded-2xl w-[90%] max-w-[400px] z-[100] shadow-2xl animate-scale-in'>
                        <div className='p-6'>
                            <div className='text-center mb-6'>
                                <div className='w-16 h-16 bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4'>
                                    <RiDeleteBin6Line className='w-8 h-8 text-red-500' />
                                </div>
                                <h3 className='text-xl font-bold text-white mb-2'>
                                    Delete Vibe?
                                </h3>
                                <p className='text-gray-400'>
                                    This action cannot be undone. Your vibe will be permanently deleted.
                                </p>
                            </div>

                            <div className='flex gap-3'>
                                <button
                                    onClick={() => setShowDeleteModal(false)}
                                    disabled={isDeleting}
                                    className='flex-1 px-4 py-3 bg-gray-700 text-gray-200 rounded-xl font-semibold hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
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

            {showComments && (
                <>
                    <div className='absolute w-full h-full bg-black opacity-20'></div>
                    <div
                        ref={commentRef}
                        className="absolute z-[200] bottom-0 w-full h-[500px] rounded-t-4xl bg-[#0e1718] transition-transform duration-300 ease-in-out left-0 shadow-2xl shadow-black flex flex-col"
                    >
                        {/* Your existing comments code stays the same */}
                        <div className="text-white flex flex-col h-full">
                            <h3 className="text-lg font-semibold text-center py-4 border-b border-gray-800">
                                Comments
                            </h3>

                            <div className="flex-1 overflow-y-auto px-4 py-2">
                                {vibe?.comments?.length === 0 ? (
                                    <div className="text-gray-400 text-center mt-5">
                                        No comments yet...
                                    </div>
                                ) : (
                                    vibe?.comments.map((com, i) => (
                                        <div key={i}
                                            className="w-full flex gap-[10px] border-b border-gray-800 py-3" >
                                            <div onClick={() => navigate(`/profile/${com?.author?.userName}`)}
                                                className="w-[35px] h-[35px] rounded-full border-2 shrink-0 border-gray-600 cursor-pointer overflow-hidden" >
                                                <img className="w-full h-full object-cover"
                                                    src={com?.author?.profileImage || assets.avataricon} alt="" />
                                            </div>
                                            <div className="flex-1">
                                                <div onClick={() => navigate(`/profile/${com?.author?.userName}`)} className="text-[12px] cursor-pointer text-blue-400 mb-1">
                                                    @{com?.author?.userName}
                                                </div>
                                                <div className="text-[14px] text-white">{com?.message}</div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>

                            <div className="w-full h-[80px] flex items-center justify-between px-4 border-t border-gray-800 bg-[#0e1718] shrink-0">
                                <div className="w-[35px] h-[35px] rounded-full border-2 shrink-0 border-gray-600 cursor-pointer overflow-hidden">
                                    <img className="w-full h-full object-cover" src={userData?.profileImage || assets.avataricon} alt="" />
                                </div>
                                <input
                                    type="text"
                                    value={message}
                                    className="flex-1 mx-3 px-3 py-2 bg-gray-800 text-white rounded-lg outline-none placeholder-gray-400"
                                    placeholder="Write Comment..."
                                    onChange={(e) => setMessage(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && handleComment()}
                                />

                                <button
                                    onClick={handleComment}
                                    disabled={!message.trim()}
                                    className={`p-2 rounded-lg transition-colors ${message.trim()
                                        ? "text-blue-500 hover:bg-gray-800"
                                        : "text-gray-500 cursor-not-allowed"
                                        }`}>
                                    <IoSend className="w-[20px] h-[20px]" />
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}

export default VibeCard
