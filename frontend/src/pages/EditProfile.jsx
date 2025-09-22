import React, { useRef, useState, useCallback } from 'react'
import { MdOutlineKeyboardBackspace } from "react-icons/md";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import assets from '../assets/assets';
import { servalUrl } from '../App';
import { setProfileData, setUserData } from '../redux/userSlice';
import { ClipLoader } from 'react-spinners';
import axios from 'axios';
import Cropper from 'react-easy-crop';
import { getCroppedImg } from '../utils/cropImageUtils'; // Your utility function

const EditProfile = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const imageInput = useRef()
    const { profileData, userData } = useSelector(state => state.user)
    
    // Existing states
    const [frontendImage, setFrontendImage] = useState(userData?.profileImage || assets.avataricon)
    const [backEndImage, setBackEndImage] = useState(null)
    const [name, setName] = useState(userData?.name || '')
    const [userName, setUserName] = useState(userData?.userName || '')
    const [bio, setBio] = useState(userData?.bio || '')
    const [profession, setProfession] = useState(userData?.profession || '')
    const [gender, setGender] = useState(userData?.gender || '')
    const [loading, setLoading] = useState(false)

    // New states for cropping
    const [showCropModal, setShowCropModal] = useState(false)
    const [imageToCrop, setImageToCrop] = useState(null)
    const [crop, setCrop] = useState({ x: 0, y: 0 })
    const [zoom, setZoom] = useState(1)
    const [cropAreaPixels, setCropAreaPixels] = useState(null)
    const [cropLoading, setCropLoading] = useState(false)

    const handleImage = async (e) => {
        const file = e.target.files[0]
        if (file) {
            const imageUrl = URL.createObjectURL(file)
            setImageToCrop(imageUrl)
            setShowCropModal(true)
        }
    }

    const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
        setCropAreaPixels(croppedAreaPixels)
    }, [])

    const handleCropSave = async () => {
        setCropLoading(true)
        try {
            const croppedImageUrl = await getCroppedImg(imageToCrop, cropAreaPixels)
            
            // Convert cropped image to File object
            const response = await fetch(croppedImageUrl)
            const blob = await response.blob()
            const croppedFile = new File([blob], 'cropped-image.jpg', { type: 'image/jpeg' })
            
            setBackEndImage(croppedFile)
            setFrontendImage(croppedImageUrl)
            setShowCropModal(false)
            setCropLoading(false)
            
            // Cleanup
            URL.revokeObjectURL(imageToCrop)
        } catch (error) {
            // console.error('Crop error:', error)
            setCropLoading(false)
        }
    }

    const handleCropCancel = () => {
        setShowCropModal(false)
        URL.revokeObjectURL(imageToCrop)
        setImageToCrop(null)
        setCrop({ x: 0, y: 0 })
        setZoom(1)
    }

    const handleEditProfile = async () => {
        setLoading(true)
        try {
            const formdata = new FormData()
            formdata.append("name", name)
            formdata.append("userName", userName)
            formdata.append("bio", bio)
            formdata.append("profession", profession)
            formdata.append("gender", gender)
            if (backEndImage) {
                formdata.append("profileImage", backEndImage)
            }
            const result = await axios.post(`${servalUrl}/api/user/editProfile`, formdata, { withCredentials: true })
            dispatch(setProfileData(result.data))
            dispatch(setUserData(result.data))
            setLoading(false)
            navigate(`/profile/${userData.userName}`)
        } catch (error) {
            setLoading(false)
            // console.log(error)
        }
    }

    return (
        <div className='w-full min-h-screen bg-black flex items-center flex-col gap-5 relative'>
            <div className='w-full h-[80px] flex items-center gap-[20px] px-[20px]'>
                <MdOutlineKeyboardBackspace 
                    className='text-white w-[25px] h-[25px] cursor-pointer' 
                    onClick={() => navigate(`/profile/${userData.userName}`)} 
                />
                <h1 className='text-white text-[20px] font-semibold'>Edit Profile</h1>
            </div>

            <div onClick={() => imageInput.current.click()}
                className='w-[80px] h-[80px] md:w-[100px] md:h-[100px] border-2 border-gray-600 rounded-full cursor-pointer overflow-hidden hover:border-blue-500 transition-colors'>
                <input 
                    onChange={handleImage}
                    type="file" 
                    accept='image/*' 
                    ref={imageInput} 
                    hidden 
                />
                <img className='w-full h-full object-cover' src={frontendImage} alt="" />
            </div>
            
            <div onClick={() => imageInput.current.click()}
                className='text-blue-500 text-center text-[18px] font-semibold cursor-pointer hover:text-blue-400 transition-colors'>
                Change your profile picture
            </div>

            <input onChange={(e) => setName(e.target.value)}
                type="text" value={name} 
                className='w-[90%] max-w-[600px] h-[60px] bg-[#0a1010] border-2 border-gray-700 rounded-2xl text-white font-semibold px-5 outline-none focus:border-blue-500 transition-colors' 
                placeholder='Enter Your Name' 
            />
            
            <input onChange={(e) => setUserName(e.target.value)}
                type="text" value={userName} 
                className='w-[90%] max-w-[600px] h-[60px] bg-[#0a1010] border-2 border-gray-700 rounded-2xl text-white font-semibold px-5 outline-none focus:border-blue-500 transition-colors' 
                placeholder='Enter Your User Name' 
            />
            
            <input onChange={(e) => setBio(e.target.value)}
                type="text" value={bio} 
                className='w-[90%] max-w-[600px] h-[60px] bg-[#0a1010] border-2 border-gray-700 rounded-2xl text-white font-semibold px-5 outline-none focus:border-blue-500 transition-colors' 
                placeholder='Bio' 
            />
            
            <input onChange={(e) => setProfession(e.target.value)}
                type="text" value={profession} 
                className='w-[90%] max-w-[600px] h-[60px] bg-[#0a1010] border-2 border-gray-700 rounded-2xl text-white font-semibold px-5 outline-none focus:border-blue-500 transition-colors' 
                placeholder='Profession' 
            />
            
           <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className='w-[90%] max-w-[600px] h-[60px] bg-[#0a1010] border-2 border-gray-700 rounded-2xl text-white font-semibold px-5 outline-none focus:border-blue-500 transition-colors'
            >
                <option value="" disabled>
                    Select Gender
                </option>
                <option value="male">Male</option>
                <option value="female">Female</option>
            </select>
            
            <button onClick={handleEditProfile}
                className='px-[10px] w-[60%] max-w-[400px] py-[5px] h-[50px] bg-white cursor-pointer rounded-2xl hover:bg-gray-100 transition-colors font-semibold'>
                {loading ? <ClipLoader size={30} color='black' /> : "Save Profile"}
            </button>

            {/* Image Crop Modal */}
            {showCropModal && (
                <div className='fixed inset-0 bg-black bg-opacity-90 z-50 flex flex-col'>
                    {/* Header */}
                    <div className='w-full h-[60px] flex items-center justify-between px-4 border-b border-gray-700'>
                        <button 
                            onClick={handleCropCancel}
                            className='text-white text-[16px] hover:text-gray-300 transition-colors'
                        >
                            Cancel
                        </button>
                        <h2 className='text-white text-[18px] font-semibold'>Crop Image</h2>
                        <button 
                            onClick={handleCropSave}
                            disabled={cropLoading}
                            className='bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50'
                        >
                            {cropLoading ? <ClipLoader size={16} color='white' /> : 'Done'}
                        </button>
                    </div>

                    {/* Cropper Area */}
                    <div className='flex-1 relative'>
                        <Cropper
                            image={imageToCrop}
                            crop={crop}
                            zoom={zoom}
                            aspect={1} // Square aspect ratio like Instagram
                            onCropChange={setCrop}
                            onZoomChange={setZoom}
                            onCropComplete={onCropComplete}
                            showGrid={true}
                            style={{
                                containerStyle: {
                                    width: '100%',
                                    height: '100%',
                                    backgroundColor: '#000'
                                }
                            }}
                        />
                    </div>

                    {/* Controls */}
                    <div className='w-full p-4 border-t border-gray-700'>
                        <div className='flex items-center gap-4 max-w-md mx-auto'>
                            <span className='text-white text-sm min-w-[60px]'>Zoom</span>
                            <input
                                type="range"
                                min={1}
                                max={3}
                                step={0.1}
                                value={zoom}
                                onChange={(e) => setZoom(e.target.value)}
                                className='flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider'
                            />
                            <span className='text-white text-sm min-w-[40px]'>{zoom.toFixed(1)}x</span>
                        </div>
                        
                        {/* Instructions */}
                        <div className='text-center text-gray-400 text-sm mt-3'>
                            Drag to reposition • Pinch or use slider to zoom
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default EditProfile
