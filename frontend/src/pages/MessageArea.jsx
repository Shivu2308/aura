import React from 'react'
import { MdOutlineKeyboardBackspace } from 'react-icons/md'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import assets from '../assets/assets'
import { LuImage } from 'react-icons/lu'
import { RxCrossCircled } from "react-icons/rx";
import { IoSend } from 'react-icons/io5'
import { useState } from 'react'
import { useRef } from 'react'
import axios from 'axios'
import { servalUrl } from '../App'
import { setMessages } from '../redux/messageSlice'
import { useEffect } from 'react'
import SenderMessage from '../components/SenderMessage'
import ReciverMessage from '../components/ReciverMessage'
import { ClipLoader } from 'react-spinners'

const MessageArea = () => {
    const [input, setInput] = useState('')
    const [frontendImage, setFrontendImage] = useState(null)
    const [backendImage, setBackendImage] = useState(null)
    const [loading, setLoading] = useState(false)
    const { userData } = useSelector(state => state.user)
    const { selectedUser, messages } = useSelector(state => state.message)
    const { socket } = useSelector(state => state.socket)
    
    // console.log(selectedUser)
    const navigate = useNavigate()
    const imageInput = useRef()
    const dispatch = useDispatch()

    const handleImage = (e) => {
        const file = e.target.files[0]
        if (!file) return;
        setBackendImage(file)
        setFrontendImage(URL.createObjectURL(file))
    }

    const handleCancleImage = () => {
        setBackendImage(null)
        setFrontendImage(null)
    }

    const handleSendMessage = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            const formData = new FormData()
            formData.append('message', input)
            if(backendImage){
                formData.append('image', backendImage)
            }
            const result = await axios.post(`${servalUrl}/api/message/send/${selectedUser._id}`,formData, {withCredentials:true})
            dispatch(setMessages([...messages, result.data]))
            setInput('')
            setBackendImage(null)
            setLoading(false)
        setFrontendImage(null)
        } catch (error) {
            setLoading(false)
            console.log(error)
        }
    }

    const getAllMessages = async () => {
        try {
            const result = await axios.get(`${servalUrl}/api/message/getAllMessages/${selectedUser._id}`, {withCredentials:true})
            console.log(result.data)
            dispatch(setMessages(result.data))
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getAllMessages()
    }, [])

    useEffect(() => {
        socket?.on("NewMessage", (mess) => {
            dispatch(setMessages([...messages, mess]))
        })
        return () => socket.off("NewMessage")
    }, [messages, setMessages])
    



    return (
        <div className='w-full h-[100vh] bg-black relative'>
            {/* top */}
            <div className="flex items-center gap-[15px] px-5 py-[10px] fixed top-0 bg-black w-full z-[100]">
                <div className='w-full h-[60px] flex items-center gap-[20px] '>
                    <MdOutlineKeyboardBackspace
                        className='text-white w-[25px] h-[25px] cursor-pointer'
                        onClick={() => navigate(`/messages`)}
                    />
                    <div onClick={() => navigate(`/profile/${selectedUser.userName}`)} className='w-[40px] md:w-[50px] h-[40px] md:h-[50px] rounded-full shrink-0 cursor-pointer overflow-hidden'>
                        <img className='w-full h-full object-cover' src={selectedUser?.profileImage || assets.avataricon} alt="" />
                    </div>
                    <div className='text-white text-[16px] md:text-[18px] font-semibold'>
                        <div className=''>{selectedUser?.userName}</div>
                        <div className='text-[12px] md:text-[14px] text-gray-400'>{selectedUser?.name}</div>
                    </div>
                </div>
            </div>


            {/* messages  */}
            <div className='w-full max-w-[800px] h-[80%] pt-[100px] px-[40px] flex flex-col gap-[40px] mx-auto overflow-auto bg-black'>
                { messages && messages.map((mess, i) => (
                    mess?.sender == userData?._id ? <SenderMessage key={i} message={mess} /> : <ReciverMessage message={mess} />
                ))}
            </div>

            {/* message input  */}
            <div className='w-full h-[80px] fixed bottom-0 flex justify-center items-center bg-black z-[100]'>
                <form onSubmit={handleSendMessage} className='w-[90%] max-w-[800px] h-[80%] rounded-full bg-[#131616]  flex items-center gap-[10px] px-5 relative'>
                    {frontendImage &&
                        <div className='w-[100px] rounded-2xl h-[100px] absolute top-[-120px] right-[10px] overflow-hidden'>
                            <img src={frontendImage} alt="" className='h-full object-cover' />
                            <div onClick={handleCancleImage} className=' p-1 bg-black rounded-full absolute right-0 top-0'>
                                <RxCrossCircled className='w-[20px] h-[20px] text-white' />
                            </div>
                        </div>
                    }
                    <input onChange={(e) => setInput(e.target.value)}
                        type="text" value={input} placeholder='Message...' className='w-full h-full px-5 text-[16px] md:text-[18px] text-white outline-0' />
                    <input type="file" accept='image/*' ref={imageInput} className='hidden' onChange={handleImage} />
                    <div onClick={() => imageInput.current.click()}>
                        <LuImage className='w-[28px] h-[28px] text-white' />
                    </div>
                    { (input || frontendImage) &&
                        <button disabled={loading} className='w-[60px] h-[40px] rounded-full bg-gradient-to-br from-[#9500ff] to-[#ff0095] flex items-center justify-center cursor-pointer'>
                            {loading ? <ClipLoader size={25} color='white'/> : <IoSend className='w-5 md:w-[25px] h-5 md:h-[25px] text-white' />}
                            </button>
                    }
                </form>
            </div>
        </div>
    )
}

export default MessageArea
