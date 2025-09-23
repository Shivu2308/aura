import React, { useMemo, useState, useRef, useEffect } from 'react'
import assets from '../assets/assets'
import { useDispatch, useSelector } from 'react-redux'
import VideoPlayer from './VideoPlayer'
import { GoHeart, GoHeartFill } from 'react-icons/go'
import { MdOutlineModeComment } from 'react-icons/md'
import { BsBookmarkFill } from "react-icons/bs";
import { BsBookmark } from "react-icons/bs";
import { IoSend, IoClose } from "react-icons/io5";
import axios from 'axios'
import { servalUrl } from '../App'
import { setPostData } from '../redux/postSlice'
import { setUserData } from '../redux/userSlice'
import FollowBtn from './FollowBtn'
import { useNavigate } from 'react-router-dom'
import { RiDeleteBin6Line } from 'react-icons/ri'
import { BiLoader } from 'react-icons/bi'

const Post = ({ post }) => {
  // console.log(post)
  const [showComments, setShowComments] = useState(false)
  const [message, setMessage] = useState('')
  const [isLiking, setIsLiking] = useState(false)
  const [isCommenting, setIsCommenting] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
    // Double click like states
  const [showHeartAnimation, setShowHeartAnimation] = useState(false)
  const [lastTap, setLastTap] = useState(0)

  const commentModalRef = useRef()
  const commentsEndRef = useRef()
  const inputRef = useRef()
  const deleteModalRef = useRef()

  const { userData } = useSelector(state => state.user)
  const { postData } = useSelector(state => state.post)
  const { socket } = useSelector(state => state.socket)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const isSaved = useMemo(() => {
    return userData.saved?.some(savedPost =>
      savedPost._id?.toString() === post._id?.toString()
    ) || false
  }, [userData.saved, post._id])

  const isLiked = useMemo(() => {
    return post.likes?.includes(userData._id) || false
  }, [post.likes, userData._id])

  // Auto scroll to bottom when comments open or new comment added
  const scrollToBottom = () => {
    commentsEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    if (showComments && post?.comments?.length > 0) {
      setTimeout(scrollToBottom, 100)
    }
  }, [showComments, post?.comments])

  // Focus input when modal opens
  useEffect(() => {
    if (showComments && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 300)
    }
  }, [showComments])

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (commentModalRef.current && !commentModalRef.current.contains(e.target)) {
        setShowComments(false)
      }
      if (deleteModalRef.current && !deleteModalRef.current.contains(e.target)) {
        setShowDeleteModal(false)
      }
    }

    if (showComments || showDeleteModal) {
      document.addEventListener('mousedown', handleClickOutside)
      document.body.style.overflow = 'hidden'
    } else {
      document.removeEventListener('mousedown', handleClickOutside)
      document.body.style.overflow = 'auto'
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.body.style.overflow = 'auto'
    }
  }, [showComments, showDeleteModal])

  // Handle keyboard events
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((showComments || showDeleteModal) && e.key === 'Escape') {
        setShowComments(false)
        setShowDeleteModal(false)
      }
    }
    if (showComments || showDeleteModal) {
      document.addEventListener('keydown', handleKeyDown)
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [showComments, showDeleteModal])

  const handleLike = async () => {
    if (isLiking) return
    setIsLiking(true)

    try {
      const result = await axios.get(`${servalUrl}/api/post/like/${post._id}`, { withCredentials: true })
      const updatedPost = result.data
      const updatedPosts = postData.map(p => p._id === post._id ? updatedPost : p)
      dispatch(setPostData(updatedPosts))

      // Add haptic feedback
      if (navigator.vibrate) {
        navigator.vibrate(50)
      }
    } catch (error) {
      console.log('Error liking post:', error)
    } finally {
      setIsLiking(false)
    }
  }

    // Double click like handler for desktop
  const handleDoubleClick = async (e) => {
    // e.preventDefault()
    if (!isLiked) {
      await handleLike()
      console.log("double click")
    }
    setShowHeartAnimation(true)
  }

    const handleTouchStart = async (e) => {
    const currentTime = new Date().getTime()
    const tapLength = currentTime - lastTap
    
    if (tapLength < 500 && tapLength > 0) {
      // Double tap detected
      // e.preventDefault()
      if (!isLiked) {
       await handleLike()
      }
      setShowHeartAnimation(true)
    }
    setLastTap(currentTime)
  }

    useEffect(() => {
    if (showHeartAnimation) {
      const timer = setTimeout(() => {
        setShowHeartAnimation(false)
      }, 1500)
      return () => clearTimeout(timer)
    }
  }, [showHeartAnimation])

  const handleComment = async () => {
    if (!message.trim() || isCommenting) return

    setIsCommenting(true)
    const tempMessage = message
    setMessage('') // Clear input immediately for better UX

    try {
      const result = await axios.post(`${servalUrl}/api/post/comment/${post._id}`, { message: tempMessage }, { withCredentials: true })
      const updatedPost = result.data
      const updatedPosts = postData.map(p => p._id === post._id ? updatedPost : p)
      dispatch(setPostData(updatedPosts))

      // Auto scroll to new comment
      setTimeout(scrollToBottom, 100)
    } catch (error) {
      console.log('Error posting comment:', error)
      setMessage(tempMessage) // Restore message on error
    } finally {
      setIsCommenting(false)
    }
  }

  const handleSave = async () => {
    if (isSaving) return
    setIsSaving(true)

    try {
      const result = await axios.get(`${servalUrl}/api/post/saved/${post._id}`, { withCredentials: true })
      dispatch(setUserData(result.data))
    } catch (error) {
      console.log('Error saving post:', error)
    } finally {
      setIsSaving(false)
    }
  }

  // Delete post functionality
  const handleDeleteConfirm = async () => {
    setIsDeleting(true)
    
    try {
      const result = await axios.delete(`${servalUrl}/api/post/delete/${post._id}`, { withCredentials: true })
      

      const updatedPosts = postData.filter(p => p._id !== post._id)
      dispatch(setPostData(updatedPosts))
      

      const updatedUserData = {
        ...userData,
        post: userData.post.filter(postId => postId !== post._id)
      }
      dispatch(setUserData(updatedUserData))
      
      setShowDeleteModal(false)
      
      // Show success message (you can replace with toast)
      // console.log('Post deleted successfully!')
      
    } catch (error) {
      console.error('Error deleting post:', error)
      // alert(error.response?.data?.message || 'Failed to delete post. Please try again.')
    } finally {
      setIsDeleting(false)
    }
  }

  const handleDelete = () => {
    setShowDeleteModal(true)
  }

  const handleCommentsToggle = () => {
    setShowComments(true)
  }

  const handleCloseComments = () => {
    setShowComments(false)
    setMessage('') // Clear any pending message
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleComment()
    }
  }

  // Socket listeners for real-time updates
  useEffect(() => {
    socket?.on("likedOnPost", (updatedData) => {
      const updatedPosts = postData.map(p => p._id === updatedData.postId ? { ...p, likes: updatedData.likes } : p)
      dispatch(setPostData(updatedPosts))
    })

    socket?.on("commentedOnPost", (updatedData) => {
      const updatedPosts = postData.map(p => p._id === updatedData.postId ? { ...p, comments: updatedData.comments } : p)
      dispatch(setPostData(updatedPosts))
    })

    // Listen for post deletion events
    socket?.on("postDeleted", (data) => {
      const updatedPosts = postData.filter(p => p._id !== data.postId)
      dispatch(setPostData(updatedPosts))
      
      // Show notification if it's not current user's post
      if (data.authorId !== userData._id) {
        console.log('A post was removed from your feed')
      }
    })

    return () => {
      socket?.off("likedOnPost")
      socket?.off("commentedOnPost")
      socket?.off("postDeleted")
    }
  }, [socket, postData, dispatch, userData._id])

  if (!post) {
    return (
      <div className='w-[90%] h-96 flex items-center justify-center bg-white rounded-2xl shadow-2xl'>
        <div className='w-8 h-8 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin'></div>
      </div>
    )
  }

  return (
    <>
      <div className='w-[90%] flex flex-col gap-[10px] bg-white items-center shadow-2xl shadow-[#00000058] rounded-2xl pb-5 transition-all duration-300 hover:shadow-3xl'>
        {/* Post Header */}
        <div className='w-full h-[70px] md:h-[80px] flex justify-between items-center px-[10px]'>
          <div onClick={() => navigate(`/profile/${post?.author?.userName}`)}
            className='flex justify-center items-center gap-[10px] md:gap-5 cursor-pointer hover:opacity-80 transition-opacity'>
            <div className='w-[40px] h-[40px] md:w-[60px] md:h-[60px] rounded-full border-2 border-black cursor-pointer overflow-hidden hover:border-blue-500 transition-colors'>
              <img className='w-full h-full object-cover' src={post?.author?.profileImage || assets.avataricon} alt={`${post?.author?.userName}'s avatar`} />
            </div>
            <div className='w-[150px] font-bold truncate'>{post?.author?.userName}</div>
          </div>
          {userData._id !== post.author._id ? (
            <FollowBtn
              targetUserId={post?.author?._id}
              tailwind={'px-[10px] w-[80px] md:w-[100px] py-[5px] h-[35px] md:h-[40px] bg-black text-white rounded-2xl text-[14px] md:text-[16px] hover:bg-gray-800 transition-colors'}
            />
          ) : (
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className={`flex items-center justify-center p-2 rounded-full transition-all duration-200 ${
                isDeleting 
                  ? 'opacity-50 cursor-not-allowed' 
                  : 'hover:bg-red-50 hover:text-red-600 cursor-pointer'
              }`}
              title="Delete Post"
            >
              {isDeleting ? (
                <BiLoader className='h-[25px] w-[25px] animate-spin' />
              ) : (
                <RiDeleteBin6Line className='h-[25px] w-[25px]' />
              )}
            </button>
          )}
        </div>

        {/* Post Media */}
        <div onDoubleClick={handleDoubleClick}
        onTouchStart={handleTouchStart}
         className='w-[90%] max-w-[500px] flex items-center relative justify-center'>
          {post?.mediaType === "image" && (
            <div className='w-full flex items-center justify-center rounded-2xl overflow-hidden'>
              <img
                className='w-full rounded-2xl max-w-full object-cover hover:scale-105 transition-transform duration-300'
                src={post?.media}
                alt="Post content"
                loading="lazy"
              />
            </div>
          )}

          {post.mediaType === "video" && (
            <div className='w-[80%] flex items-center justify-center rounded-2xl overflow-hidden'>
              <VideoPlayer media={post?.media} />
            </div>
          )}


          {showHeartAnimation && (
            <div className='absolute inset-0 flex items-center justify-center pointer-events-none z-[100]'>
              <div className='animate-pulse'>
                <GoHeartFill className='w-20 h-20 text-red-500 drop-shadow-lg animate-bounce' />
              </div>
              {/* <div className='absolute animate-pulse'>
                <GoHeartFill className='w-16 h-16 text-white drop-shadow-lg' />
              </div> */}
            </div>
          )}

        </div>

        {/* Post Actions */}
        <div className='w-[90%] h-[50px] flex justify-between items-center px-[10px] mt-[10px]'>
          <div className='flex justify-center items-center gap-[15px]'>
            {/* Like Button */}
            <div className='flex justify-center items-center gap-[5px]'>
              <button
                onClick={handleLike}
                disabled={isLiking}
                className={`transition-all duration-200 ${isLiked ? 'scale-110' : 'hover:scale-110'} ${isLiking ? 'opacity-50' : ''}`}
              >
                {isLiked ? (
                  <GoHeartFill className='w-[25px] h-[25px] cursor-pointer text-red-600' />
                ) : (
                  <GoHeart className='w-[25px] h-[25px] cursor-pointer hover:text-red-500 transition-all' />
                )}
              </button>
              <span className='font-semibold'>{post.likes?.length || 0}</span>
            </div>

            {/* Comment Button */}
            <button
              onClick={handleCommentsToggle}
              className='flex justify-center items-center gap-[5px] cursor-pointer hover:opacity-70 transition-all duration-200 hover:scale-105'
            >
              <MdOutlineModeComment className='w-[25px] h-[25px]' />
              <span className='font-semibold'>{post.comments?.length || 0}</span>
            </button>
          </div>

          {/* Save Button */}
          <button
            onClick={handleSave}
            disabled={isSaving}
            className={`cursor-pointer hover:opacity-70 transition-all duration-200 hover:scale-110 ${isSaving ? 'opacity-50' : ''}`}
          >
            {isSaved ? (
              <BsBookmarkFill className='w-[25px] h-[25px] text-black' />
            ) : (
              <BsBookmark className='w-[25px] h-[25px]' />
            )}
          </button>
        </div>

        {/* Post Caption */}
        {post.caption && (
          <div className='w-full px-5 gap-[10px] flex justify-start items-start'>
            <h1 className='font-bold text-blue-600 cursor-pointer hover:text-blue-800 transition-colors text-[14px] sm:text-[16px]'
              onClick={() => navigate(`/profile/${post?.author?.userName}`)}>
              {post.author.userName}
            </h1>
            <div className='flex-1 text-[14px] sm:text-[16px] break-words truncate'>{post.caption}</div>
          </div>
        )}

        {/* Comments Preview */}
        {post?.comments?.length > 0 && !showComments && (
          <div className='w-full px-5'>
            <button
              className='text-gray-500 text-sm cursor-pointer hover:text-gray-700 transition-colors mb-2 font-medium'
              onClick={handleCommentsToggle}
            >
              View all {post.comments.length} comments
            </button>
            {post.comments.slice(-2).map((com, i) => (
              <div key={i} className='flex items-start gap-2 mb-1 text-sm'>
                <span
                  className='font-semibold text-blue-600 cursor-pointer hover:text-blue-800 transition-colors'
                  onClick={() => navigate(`/profile/${com?.author?.userName}`)}
                >
                  {com?.author?.userName}
                </span>
                <span className='flex-1 break-words'>{com?.message}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <>
          <div className='fixed inset-0 bg-black/50 z-[90] transition-opacity duration-300'></div>
          <div
            ref={deleteModalRef}
            className='fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl w-[90%] max-w-[400px] z-[100] shadow-2xl animate-scale-in'
          >
            <div className='p-6'>
              <div className='text-center mb-6'>
                <div className='w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                  <RiDeleteBin6Line className='w-8 h-8 text-red-600' />
                </div>
                <h3 className='text-xl font-bold text-gray-900 mb-2'>
                  Delete Post?
                </h3>
                <p className='text-gray-600'>
                  This action cannot be undone. Your post will be permanently deleted.
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

      {/* Comments Modal - (Rest of your existing comments modal code remains the same) */}
      {showComments && (
        <>
          <div className='fixed inset-0 bg-black/50 z-[80] transition-opacity duration-300'></div>
          <div
            ref={commentModalRef}
            className='bg-white fixed bottom-0 left-1/2 transform -translate-x-1/2 rounded-t-2xl w-full max-w-[500px] max-h-[75vh] z-[100] flex flex-col overflow-hidden shadow-2xl animate-slide-up'
          >
            {/* Modal Header */}
            <div className='flex items-center justify-between p-4 border-b border-gray-200 bg-white sticky top-0 z-10'>
              <h3 className='text-lg font-semibold'>Comments</h3>
              <button
                onClick={handleCloseComments}
                className='w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors'
                aria-label="Close comments"
              >
                <IoClose className='w-6 h-6 text-gray-500' />
              </button>
            </div>

            {/* Post Preview in Modal */}
            <div className='flex items-center gap-3 p-4 border-b border-gray-100 bg-gray-50'>
              <div className='w-10 h-10 rounded-full overflow-hidden border-2 border-gray-300'>
                <img
                  className='w-full h-full object-cover'
                  src={post?.author?.profileImage || assets.avataricon}
                  alt={`${post?.author?.userName}'s avatar`}
                />
              </div>
              <div className='flex-1 min-w-0'>
                <div className='font-semibold text-sm text-blue-600 cursor-pointer hover:text-blue-800 transition-colors'
                  onClick={() => navigate(`/profile/${post?.author?.userName}`)}>
                  {post?.author?.userName}
                </div>
                {post.caption && (
                  <div className='text-sm text-gray-600 line-clamp-2 break-words'>{post.caption}</div>
                )}
              </div>
            </div>

            {/* Comments List */}
            <div className='flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth'>
              {post?.comments?.length === 0 ? (
                <div className='text-center text-gray-500 py-10'>
                  <MdOutlineModeComment className='w-12 h-12 mx-auto mb-3 text-gray-300' />
                  <p className='font-semibold'>No comments yet.</p>
                  <p className='text-sm'>Be the first to comment!</p>
                </div>
              ) : (
                post?.comments?.map((com, i) => (
                  <div key={com._id || i} className='flex gap-3 animate-fade-in'>
                    <button
                      onClick={() => navigate(`/profile/${com?.author?.userName}`)}
                      className='w-8 h-8 rounded-full overflow-hidden border border-gray-300 hover:border-gray-400 transition-colors flex-shrink-0'
                    >
                      <img
                        className='w-full h-full object-cover'
                        src={com?.author?.profileImage || assets.avataricon}
                        alt={`${com?.author?.userName}'s avatar`}
                      />
                    </button>
                    <div className='flex-1 min-w-0'>
                      <div className='bg-gray-50 rounded-2xl px-4 py-2 hover:bg-gray-100 transition-colors'>
                        <button
                          onClick={() => navigate(`/profile/${com?.author?.userName}`)}
                          className='font-semibold text-sm text-blue-600 hover:text-blue-800 transition-colors'
                        >
                          @{com?.author?.userName}
                        </button>
                        <div className='text-sm text-gray-800 mt-1 break-words'>
                          {com?.message}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
              <div ref={commentsEndRef} />
            </div>

            {/* Comment Input */}
            <div className='border-t border-gray-200 p-4 bg-white sticky bottom-0'>
              <div className='flex items-center gap-3'>
                <div className='w-8 h-8 rounded-full overflow-hidden border border-gray-300 flex-shrink-0'>
                  <img
                    className='w-full h-full object-cover'
                    src={userData?.profileImage || assets.avataricon}
                    alt="Your avatar"
                  />
                </div>
                <div className='flex-1 relative'>
                  <textarea
                    ref={inputRef}
                    value={message}
                    rows={1}
                    className='w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-full outline-none focus:border-blue-500 focus:bg-white transition-colors pr-12 resize-none overflow-hidden'
                    placeholder='Write a comment...'
                    onChange={(e) => {
                      setMessage(e.target.value)
                      // Auto resize textarea
                      e.target.style.height = 'auto'
                      e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px'
                    }}
                    onKeyPress={handleKeyPress}
                    disabled={isCommenting}
                  />
                  <button
                    onClick={handleComment}
                    disabled={!message.trim() || isCommenting}
                    className={`absolute right-2 top-1/2 transform -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 ${message.trim() && !isCommenting
                        ? 'text-blue-500 hover:bg-blue-50 cursor-pointer hover:scale-110'
                        : 'text-gray-400 cursor-not-allowed'
                      }`}
                    aria-label="Send comment"
                  >
                    {isCommenting ? (
                      <div className='w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin'></div>
                    ) : (
                      <IoSend className='w-4 h-4' />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  )
}

export default Post
