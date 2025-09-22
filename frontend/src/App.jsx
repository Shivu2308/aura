import React, { useEffect } from 'react'
import { Navigate, Route, Router, Routes } from 'react-router-dom'
import SignUp from './pages/SignUp'
import SignIn from './pages/SignIn'
import ForgotPassword from './pages/ForgotPassword'
import Home from './pages/Home'
import { useDispatch, useSelector } from 'react-redux'
import getCurrentUser from './hooks/getCurrentUser'
import getSuggestedUsers from './hooks/getSuggestedUsers'
import Profile from './pages/Profile'
import EditProfile from './pages/EditProfile'
import Upload from './pages/Upload'
import getAllPosts from './hooks/getAllPosts'
import Vibes from './pages/Vibes'
import getAllVibes from './hooks/getAllVibes'
import Story from './pages/Story'
import getAllStories from './hooks/getAllStories'
import Messages from './pages/Messages'
import MessageArea from './pages/MessageArea'
import io, { Socket } from 'socket.io-client'
import { setOnlineUsers, setSocket } from './redux/socketSlice'
import getFollowingList from './hooks/getFollowingList'
import getPrevChatUsers from './hooks/getPrevChatUsers'
import Search from './pages/Search'
import getAllNotifications from './hooks/getAllNotifications'
import Notifications from './pages/Notifications'
import { setNotificationsData } from './redux/userSlice'
import SuggestedUsers from './pages/SuggestedUsers'
import Following from './pages/Following'
import Followers from './pages/Followers'

export const servalUrl = 'https://aura-backend-ruddy.vercel.app'

const App = () => {
  getCurrentUser()
  getSuggestedUsers()
  getAllPosts()
  getAllVibes()
  getAllStories()
  getFollowingList()
  getPrevChatUsers()
  getAllNotifications()
  const { userData, notificationsData } = useSelector(state => state.user)
  const {socket} = useSelector(state => state.socket)
  const dispatch = useDispatch()
  
  useEffect(() => {
    if(userData){
      const socketIo = io(servalUrl, {
        query : {
          userId : userData?._id
        }
      })
      dispatch(setSocket(socketIo))

      socketIo.on('getOnlineUsers', (users)=> {
        dispatch(setOnlineUsers(users))
      })
      return () => socketIo.close()
    }else{
      if(socket){
        socket.close()
        dispatch(setSocket(null))
      }
    }
  }, [userData])


    socket?.on("newNotification", (noti) => {
      dispatch(setNotificationsData([...notificationsData, noti]))
    })
  

  return (
    <Routes>
      <Route path='/' element={userData ? <Home /> : <Navigate to={"/sign-in"}/>}/>
      <Route path='/signup' element={!userData ? <SignUp /> : <Navigate to={"/"}/>}/>
      <Route path='/sign-in' element={!userData ? <SignIn /> : <Navigate to={"/"}/>}/>
      <Route path='/forgot-password' element={!userData ? <ForgotPassword /> : <Navigate to={"/"} />}/>
      <Route path='/profile/:userName' element={userData ? <Profile /> : <Navigate to={"/sign-in"}/>}/>
      <Route path='/editprofile' element={userData ? <EditProfile /> : <Navigate to={"/sign-in"}/>}/>
      <Route path='/upload' element={userData ? <Upload /> : <Navigate to={"/sign-in"}/>}/>
      <Route path='/vibes' element={userData ? <Vibes /> : <Navigate to={"/sign-in"}/>}/>
      <Route path='/story/:userName' element={userData ? <Story /> : <Navigate to={"/sign-in"}/>}/>
      <Route path='/messages' element={userData ? <Messages /> : <Navigate to={"/sign-in"}/>}/>
      <Route path='/messageArea' element={userData ? <MessageArea /> : <Navigate to={"/sign-in"}/>}/>
      <Route path='/search' element={userData ? <Search /> : <Navigate to={"/sign-in"}/>}/>
      <Route path='/notifications' element={userData ? <Notifications /> : <Navigate to={"/sign-in"}/>}/>
      <Route path='/suggestedUsers' element={userData ? <SuggestedUsers /> : <Navigate to={"/sign-in"}/>}/>
      <Route path='/following' element={userData ? <Following /> : <Navigate to={"/sign-in"}/>}/>
      <Route path='/followers' element={userData ? <Followers /> : <Navigate to={"/sign-in"}/>}/>
    </Routes>
  )
}

export default App
