import React from 'react'
import { MdOutlineKeyboardBackspace } from 'react-icons/md'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import NotificationCard from '../components/NotificationCard'
import axios from 'axios'
import { servalUrl } from '../App'
import { useEffect } from 'react'
import getAllNotifications from '../hooks/getAllNotifications'
import { setNotificationsData } from '../redux/userSlice'

const Notifications = () => {

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { notificationsData } = useSelector(state => state.user)

    const ids = notificationsData?.map((n) => n._id)
    const markAsReed = async () => {
        try {
            const result = await axios.post(`${servalUrl}/api/user/markAsReed`, {notificationId : ids}, {withCredentials:true})
            await fetchNotifications()
        } catch (error) {
            console.log(error)
        }
    }

     const fetchNotifications = async () =>{
            try {
                const result = await axios.get(`${servalUrl}/api/user/getAllNotification`,{withCredentials:true})
                // console.log(result.data)
                dispatch(setNotificationsData(result.data))
            } catch (error) {
                console.log(error)
            }
        }

    useEffect(()=>{
        markAsReed()
    },[])

    return (
        <div className='w-full min-h-screen bg-black flex items-center flex-col gap-5 relative'>
            <div className='w-full h-[80px] flex items-center gap-[20px] px-[20px] lg:hidden'>
                <MdOutlineKeyboardBackspace
                    className='text-white w-[25px] h-[25px] cursor-pointer'
                    onClick={() => navigate(`/`)}
                />
                <h1 className='text-white text-[20px] font-semibold'>Notifications</h1>
            </div>
            <div className='w-full h-[100%] flex flex-col px-[10px] gap-2'>
                { notificationsData.map((noti) => (
                    <NotificationCard noti={noti} key={noti?._id} />
                ))}
            </div>
        </div>
    )
}

export default Notifications
