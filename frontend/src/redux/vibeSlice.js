import { createSlice } from "@reduxjs/toolkit";

const vibeSlice = createSlice({
    "name" : "vibe",
    initialState : {
        vibeData : []
    },
    reducers : {
       setVibeData : (state, action) => {
            state.vibeData = action.payload
        }
    }
})

export const {setVibeData} = vibeSlice.actions
export default vibeSlice.reducer