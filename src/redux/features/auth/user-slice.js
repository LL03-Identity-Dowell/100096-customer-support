import { createSlice } from "@reduxjs/toolkit";

const _initialState = {
    public_links: [],
    usernames: []
}

export const userSlice = createSlice({
    name: 'user',
    initialState: _initialState,
    reducers: {
        setUserProperty(state, action){
            let propertyName = action.payload.propertyName;
            let value = action.payload.value;

            state[propertyName] = value;
        }
    }
})

export const {setUserProperty} = userSlice.actions;
export default userSlice.reducer;