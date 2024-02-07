import { createSlice } from "@reduxjs/toolkit";

let _intialState = {
    server_id : null
}

export const channelsSlice = createSlice({
    name: 'channels',
    initialState: _intialState,
    reducers: {
        setServerChannels(state, action) {
            let data = action.payload.data;
            let server_id = action.payload.server_id;

            if(!state.hasOwnProperty(server_id)){
                state[server_id] = {}
            }
            if (data.status == 'success') {
                state[server_id].isLoading = false;
                state[server_id].success = true;
                state[server_id].channels = data.data;
                state[server_id].isError = false;
                state[server_id].error = '';
            } else {
                state[server_id].isLoading = false;
                state[server_id].success = false;
                state[server_id].channels = [];
                state[server_id].isError = true;
                state[server_id].error = data.data;
            }

        },

        setChannelsLoading(state, action) {
            let server_id = action.payload.server_id;
            let isLoading = action.payload.value;

            if(!state.hasOwnProperty(server_id)){
                state[server_id] = {}
            }
            
            state[server_id].isLoading = isLoading;
        },

        setServerId(state, action) {
            let server_id = action.payload.server_id;
            state.server_id = server_id;
        },

        setProperty(state, action) {
            let propertyName = action.payload.propertyName;
            let value = action.payload.value;
            let server_id = action.payload.server_id

            if (!state[server_id]) {
                state[server_id] = {};
              }
            
            if (state[server_id] && typeof state[server_id] === 'object') {
            state[server_id][propertyName] = value;
            }
        },

        addChannel(state, action){
            let data = action.payload.data;
            let newChannel = action.payload.newChannel;
            let server_id = state.server_id;
            
            if(!server_id){
                return;
            }

            if (data.status == 'success') {
                state[server_id].isLoading = false;
                state[server_id].success = true;
                state[server_id].channels.push(newChannel.name)
                state[server_id].isError = false;
                state[server_id].error = '';
            } else {
                state[server_id].isLoading = false;
                state[server_id].success = false;
                state[server_id].isError = true;
                state[server_id].channels = state[server_id].channels;
                state[server_id].error = data.data;
            }
        }


    }
})

export const {setServerChannels, setChannelsLoading, setServerId, addChannel, setProperty} = channelsSlice.actions;
export default channelsSlice.reducer;