import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
    name : "user",
    initialState : {
        userData : null,
        suggestedUsers : null,
        profileData : null,
        following : [],
        searchData : [],
        notificationsData : null
    },
    reducers : {
        setUserData : (state, action) => {
            state.userData = action.payload
            // console.log(state.userData);
        },
        setSuggestedUsers : (state, action) => {
            state.suggestedUsers = action.payload
        },
        setProfileData : (state, action) => {
            state.profileData = action.payload
        },
        setFollowing : (state, action ) => {
            state.following = action.payload
        },
        setSearchData : (state, action ) => {
            state.searchData = action.payload
        },
        toggleFollowing : (state, action) => {
            const targetUserId = action.payload
            if(state.following.includes(targetUserId)){
                state.following = state.following.filter(id => id != targetUserId)
            }else{
                state.following.push(targetUserId)
            }
        },
        setNotificationsData : (state, action ) => {
            state.notificationsData = action.payload
        },
    }
})

export const { setUserData, setSuggestedUsers, setProfileData, setFollowing, toggleFollowing, setSearchData, setNotificationsData } = userSlice.actions;
export default userSlice.reducer;