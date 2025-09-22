import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { servalUrl } from '../App'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { setProfileData, setUserData } from '../redux/userSlice'
import { setSelectedUser } from '../redux/messageSlice'
import { MdOutlineKeyboardBackspace, MdPersonAdd } from "react-icons/md";
import assets from '../assets/assets'
import Nav from '../components/Nav'
import FollowBtn from '../components/FollowBtn'
import Post from '../components/Post'

const Profile = () => {

    const [postType, setPostType] = useState("post")
    const { userName } = useParams()
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { profileData, userData } = useSelector(state => state.user)
    // console.log(profileData)
    const { postData } = useSelector(state => state.post)
    // console.log(postData)
    const handleProfile = async () => {
        try {
            const result = await axios.get(`${servalUrl}/api/user/getProfile/${userName}`, { withCredentials: true })
            // console.log(result.data)
            dispatch(setProfileData(result.data))
        } catch (error) {
            console.log(error)
        }
    }

    const handleLogout = async () => {
        try {
            const result = await axios.get(`${servalUrl}/api/auth/signout`, { withCredentials: true })
            dispatch(setUserData(null))
        } catch (error) {
            console.log(error)
        }
    }

    const handleMessageBtn = () => {
        dispatch(setSelectedUser(profileData))
        navigate('/messageArea')

    }

    useEffect(() => {
        handleProfile()
    }, [userName, dispatch])

    return (
        <div className='w-full min-h-screen bg-black'>

            <div className='w-full flex justify-between items-start p-[30px] text-white'>
                <div className='flex items-center gap-5'>
                    <MdOutlineKeyboardBackspace className='text-white w-[25px] h-[25px] cursor-pointer' onClick={() => navigate("/")} />
                    <div className='font-semibold text-[20px]'>{profileData?.userName}</div>
                </div>
                {profileData?._id === userData?._id &&
                    <div onClick={handleLogout} className='font-semibold text-[20px] cursor-pointer text-blue-500'>Log Out</div>
                }
            </div>

            <div className='max-w-[900px] flex items-start gap-5 lg:gap-[50px] pt-5 pl-[20px] justify-start sm:justify-center mx-auto '>
                <div className='w-[80px] h-[80px] md:w-[140px] md:h-[140px] border-2 border-black rounded-full cursor-pointer overflow-hidden'>
                    <img className='w-full h-full object-cover' src={profileData?.profileImage || assets.avataricon} alt="" />
                </div>
                <div>
                    <div className='font-semibold text-[18px] sm:text-[22px] text-white'>{profileData?.name}</div>

                    <div className='w-full flex items-center justify-center gap-5 sm:gap-10 md:gap-[60px] px-[20%] pt-[10px] md:pt-[30px]'>
                        <div className='text-center'>
                            <div className='text-white text-[16px] md:text-[30px] font-semibold '>{profileData?.post?.length}</div>
                            <div className='text-[16px] md:text-[22px] text-[#ffffffe7]'>Posts</div>
                        </div>

                        <Link to={'/followers'} >
                            <div className='cursor-pointer'>
                                <div className='flex items-center justify-center gap-5'>
                                    <div className='flex relative'>
                                        {profileData?.followers?.slice(0, 3).map((user, i) =>
                                            <div key={i} className={`w-[25px] h-[25px] md:w-[35px] md:h-[35px] rounded-full border-2 border-black cursor-pointer overflow-hidden `} style={{ position: i > 0 ? 'absolute' : 'relative', left: i > 0 ? `${i * 9}px` : 'auto', zIndex: 3 + i }} >
                                                <img className='w-full h-full object-cover' src={user?.profileImage || assets.avataricon} alt="" />
                                            </div>
                                        )}

                                    </div>
                                    <div className='text-white text-[16px] md:text-[30px] font-semibold'>{profileData?.followers?.length}</div>
                                </div>
                                <div className='text-[16px] md:text-[22px] text-[#ffffffe7]'>Followers</div>
                            </div>
                        </Link>

                        <Link to={'/following'}>
                            <div className=''>
                                <div className='flex items-center justify-center gap-5'>
                                    <div className='flex relative'>
                                        {profileData?.following?.slice(0, 3).map((user, i) =>

                                            <div key={i} className={`w-[25px] h-[25px] md:w-[35px] md:h-[35px] rounded-full border-2 border-black cursor-pointer overflow-hidden `} style={{ position: i > 0 ? 'absolute' : 'relative', left: i > 0 ? `${i * 9}px` : 'auto', zIndex: 3 + i }}>
                                                <img className='w-full h-full object-cover' src={user?.profileImage || assets.avataricon} alt="" />
                                                {/* {console.log(user)} */}
                                            </div>
                                        )}

                                    </div>
                                    <div className='text-white text-[16px] md:text-[30px] font-semibold'>{profileData?.following?.length}</div>
                                </div>
                                <div className='text-[16px] md:text-[22px] text-[#ffffffe7]'>Following</div>
                            </div>
                        </Link>
                    </div>

                </div>
            </div>
            <div className='sm:max-w-[350px] md:max-w-[500px] px-5 mt-5 mx-auto'>
                <div className='text-[13px] sm:text-[16px] text-[#ffffffe8]'>{profileData?.profession || "New User"}</div>
                <div className='text-[13px] sm:text-[16px] text-[#ffffffe8]'>{profileData?.bio}</div>

            </div>

            {/* <div className='w-full h-[100px] flex items-center justify-center gap-10 md:gap-[60px] px-[20%] pt-[30px]'>
                <div className='text-center'>
                    <div className='text-white text-[22px] md:text-[30px] font-semibold '>{profileData?.post?.length}</div>
                    <div className='text-[18px] md:text-[22px] text-[#ffffffe7]'>Posts</div>
                </div>
                <div className=''>
                    <div className='flex items-center justify-center gap-5'>
                        <div className='flex relative'>
                            {profileData?.followers?.slice(0, 3).map((user, i) =>
                                <div key={i} className={`w-[35px] h-[35px] rounded-full border-2 border-black cursor-pointer overflow-hidden ${i > 0 ? `absolute left-[${9 * i}px]` : ""}`}>
                                    <img className='w-full h-full object-cover' src={user?.profileImage || assets.avataricon} alt="" />
                                </div>
                            )}

                        </div>
                        <div className='text-white text-[22px] md:text-[30px] font-semibold'>{profileData?.followers?.length}</div>
                    </div>
                    <div className='text-[18px] md:text-[22px] text-[#ffffffe7]'>Followers</div>
                </div>
                <div className=''>
                    <div className='flex items-center justify-center gap-5'>
                        <div className='flex relative'>
                            {profileData?.following?.slice(0, 3).map((user, i) =>
                                <div key={i} className={`w-[35px] h-[35px] rounded-full border-2 border-black cursor-pointer overflow-hidden ${i > 0 ? `absolute left-[${9 * i}px]` : ""}`}>
                                    <img className='w-full h-full object-cover' src={user?.profileImage || assets.avataricon} alt="" />
                                </div>
                            )}

                        </div>
                        <div className='text-white text-[22px] md:text-[30px] font-semibold'>{profileData?.following?.length}</div>
                    </div>
                    <div className='text-[18px] md:text-[22px] text-[#ffffffe7]'>Following</div>
                </div>
            </div> */}

            <div className='w-full h-[80px] flex justify-center items-center gap-5 mt-[10px]'>
                {
                    profileData?._id === userData?._id &&
                    <>
                        <button onClick={() => navigate("/editprofile")}
                            className='px-[10px] min-w-[150px] py-[5px] h-[40px] bg-[white] font-semibold cursor-pointer rounded-2xl'>Edit Profile</button>
                        <Link to={'/suggestedUsers'}>
                            <MdPersonAdd onClick={() => navigate(`/`)}
                                className='px-[10px] w-fit py-[5px] h-[40px] bg-[white] font-semibold cursor-pointer rounded-2xl' />
                        </Link>
                    </>
                }
                {
                    profileData?._id !== userData?._id &&
                    <>
                        <FollowBtn targetUserId={profileData?._id} tailwind={'px-[10px] min-w-[150px] py-[5px] h-[40px] bg-[white] font-semibold cursor-pointer rounded-2xl'} />
                        <button className='px-[10px] min-w-[150px] py-[5px] h-[40px] bg-[white] font-semibold cursor-pointer rounded-2xl' onClick={handleMessageBtn}>Message</button>
                    </>
                }
            </div>

            <div className='w-full min-h-[100vh] flex justify-center'>
                <div className='w-full max-w-[900px] flex flex-col items-center rounded-t-[30px] bg-white relative gap-[20px] pt-[30px] pb-[120px]'>
                    {userData?._id == profileData?._id &&
                        <div className='w-[90%] max-w-[600px] h-[70px] bg-white rounded-full flex justify-around items-center gap-[10px]'>
                            <>
                                <div onClick={() => setPostType("post")}
                                    className={`w-[28%] h-[60%] sm:h-[80%] flex justify-center items-center text-[16px] sm:text-[19px] font-semibold cursor-pointer hover:bg-black rounded-full hover:text-white  hover:shadow-2xl hover:shadow-black ${postType === "post" ? "bg-black text-white shadow-2xl shadow-black" : ""}`}>Post</div>
                                <div onClick={() => setPostType("saved")}
                                    className={`w-[28%] h-[60%] sm:h-[80%] flex justify-center items-center text-[16px] sm:text-[19px] font-semibold cursor-pointer hover:bg-black rounded-full hover:text-white  hover:shadow-2xl hover:shadow-black ${postType === "saved" ? "bg-black text-white shadow-2xl shadow-black" : ""}`}>Saved</div>
                            </>
                        </div>
                    }
                    <Nav />
                    {
                        postType == "post" &&
                        postData?.map((post, i) => (
                            post?.author?._id == profileData?._id ? (profileData?.post?.length > 0 ? (<Post key={i} post={post} />) :
                                <div className="text-center py-16 px-4">
                                    <div className="mb-6">
                                        <div className="w-20 h-20 mx-auto mb-4 rounded-full border-2 border-gray-300 flex items-center justify-center">
                                            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                                                    d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                        </div>
                                    </div>

                                    <h3 className="text-2xl font-light text-gray-800 mb-2">
                                        Share Photos
                                    </h3>

                                    <p className="text-gray-500 text-sm mb-6 max-w-xs mx-auto">
                                        When you share photos, they will appear on your profile.
                                    </p>

                                    <button onClick={() => navigate('/upload')} className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-medium text-sm transition-colors">
                                        Share your first post
                                    </button>
                                </div>) :
                                (
                                    <div className="text-center py-16 px-4">
                                        <div className="mb-6">
                                            <div className="w-20 h-20 mx-auto mb-4 rounded-full border-2 border-gray-300 flex items-center justify-center">
                                                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                                                        d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                            </div>
                                        </div>

                                        <h3 className="text-xl font-light text-gray-800 mb-2">
                                            No Posts Yet
                                        </h3>

                                        <p className="text-gray-500 text-sm max-w-xs mx-auto">
                                            {profileData?.userName} hasn't shared any photos or videos yet.
                                        </p>
                                    </div>
                                )
                        ))
                    }
                    {
                        postType == "saved" &&
                        postData.map((post, i) => (
                            userData.saved?.some(savedPost => savedPost._id === post._id) && <Post key={i} post={post} />
                        ))
                    }
                    {/* { !profileData?.post?.length > 0  ? (
                        profileData?._id === userData?._id &&
                        <div className="text-center py-16 px-4">
                            <div className="mb-6">
                                <div className="w-20 h-20 mx-auto mb-4 rounded-full border-2 border-gray-300 flex items-center justify-center">
                                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                                            d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                </div>
                            </div>

                            <h3 className="text-2xl font-light text-gray-800 mb-2">
                                Share Photos
                            </h3>

                            <p className="text-gray-500 text-sm mb-6 max-w-xs mx-auto">
                                When you share photos, they will appear on your profile.
                            </p>

                            <button onClick={() => navigate('/upload')} className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-medium text-sm transition-colors">
                                Share your first post
                            </button>
                        </div>) :
                        (
                            <div className="text-center py-16 px-4">
                                <div className="mb-6">
                                    <div className="w-20 h-20 mx-auto mb-4 rounded-full border-2 border-gray-300 flex items-center justify-center">
                                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                                                d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                    </div>
                                </div>

                                <h3 className="text-xl font-light text-gray-800 mb-2">
                                    No Posts Yet
                                </h3>

                                <p className="text-gray-500 text-sm max-w-xs mx-auto">
                                    {profileData?.userName} hasn't shared any photos or videos yet.
                                </p>
                            </div>
                        )
                    } */}
                </div>
            </div>
        </div>
    )
}

export default Profile
