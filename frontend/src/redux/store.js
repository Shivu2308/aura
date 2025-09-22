import {configureStore} from '@reduxjs/toolkit'
import userSlice from './userSlice';
import postSlice from './postSlice'
import storySlice from './storySlice'
import vibeSlice from './vibeSlice'
import messageSlice from './messageSlice'
import socketSlice from './socketSlice'

const store = configureStore({
    reducer:{
        user : userSlice,
        post : postSlice,
        story : storySlice,
        vibe : vibeSlice,
        message : messageSlice,
        socket : socketSlice
    },


    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                // Ignore socket-related actions and paths
                ignoredActions: [
                    'socket/setSocket',
                    'user/setNotificationsData',
                    'socket/connect',
                    'socket/disconnect',
                    'message/setSocket',
                    // Add any other socket-related actions you have
                ],
                ignoredActionsPaths: [
                    'payload.socket',
                    'meta.socket',
                    'payload.socketInstance'
                ],
                ignoredPaths: [
                    'socket.socket',
                    'socket.socketInstance', 
                    'user.socket',
                    'message.socket',
                    // Add any other paths where socket is stored
                ],
            },
        }),


})

export default store;