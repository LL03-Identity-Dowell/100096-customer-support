import { faL } from "@fortawesome/free-solid-svg-icons";
import { createSlice } from "@reduxjs/toolkit";

let _initialState = {
    isLoading : true,
    isError: false,
    success: false,
    error: '',
    servers: []
}

export const serversSlice = createSlice({
    name: 'servers',
    initialState: _initialState,
    reducers: {
        setServers(state, action) {
            let data = action.payload;
            if (data.status == 'success') {
                state.isLoading = false;
                state.success = true;
                state.isError = false;
                state.servers = data.data;
                state.error = '';
            } else {
                state.isLoading = false;
                state.isError = true;
                state.error = data.data;
                state.servers = []
                state.success = false;
            }
        },
        setLoading(state, action) {
          state.isLoading = action.payload;  
        },
        setSuccess(state, action) {
            state.success = action.payload;
        },
        addServer(state, action) {
            let data = action.payload.data;
            let server_name = action.payload.name;

            if (data.status == 'success') {
                state.isLoading = false;
                state.success = true;
                state.isError = false;
                state.servers.push({
                    name : server_name,
                    id: '12345324523453'
                });
                state.error = '';
            } else {
                state.isLoading = false;
                state.isError = true;
                state.error = data.data;
                state.servers = state.servers;
                state.success = false;
            }
        }
    }
})

export const { setServers, setLoading, addServer, setSuccess } = serversSlice.actions;
export default serversSlice.reducer;