import { createSlice, current } from "@reduxjs/toolkit";

const storySlice = createSlice({
    "name" : "story",
     initialState : {
        storyData : null,
        allStoriesData : null,
        currentUserStory : null
    },
    reducers : {
       setStoryData : (state, action) => {
            state.storyData = action.payload
        },
        setAllStoriesData : (state, action) => {
            state.allStoriesData = action.payload
        },
        setCurrentUserStory : (state, action) => {
            state.currentUserStory = action.payload
        }
    }
})

export const { setStoryData, setAllStoriesData, setCurrentUserStory } = storySlice.actions
export default storySlice.reducer