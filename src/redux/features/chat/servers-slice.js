import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

const initialState = {
  isLoading: true,
  isError: false,
  success: false,
  error: "",
  servers: [],
};

const handleApiResult = (state, action) => {
  const data = action.payload;

  if (data.status === "success") {
    state.isLoading = false;
    state.success = true;
    state.isError = false;
    state.error = "";
  } else {
    console.log("data", data)
    toast.error(`servers ${data.data}`)
    state.isLoading = false;
    state.isError = true;
    state.error = data.data;
    state.servers = state.servers;
    state.success = false;
  }
};

export const serversSlice = createSlice({
  name: "servers",
  initialState: initialState,
  reducers: {
    setServers(state, action) {
        handleApiResult(state, action);
        const data = action.payload;
        state.servers = data.status === "success" ? data.data : [];
    },
    setLoading(state, action) {
      state.isLoading = action.payload;
    },
    setSuccess(state, action) {
      state.success = action.payload;
    },
    addServer(state, action) {
      const data = action.payload.data;
      if (data.status === "success") {
        const server_name = action.payload.name;
        state.servers.push({
          name: server_name,
          id: data.data.inserted_id,
        });
      }
      action.payload = data;
      handleApiResult(state, action);
    },

    setDeleteServer(state, action) {
      const data = action.payload.data;
      if(data.status == 'success') {
          const deletedServerId = action.payload.serverId;
          state.servers = state.servers.filter(
            (server) => server.id !== deletedServerId
          );
          toast.success("Server Deleted!")
      }      
      action.payload = data
      handleApiResult(state, action);
    },

    setUpdatedServer(state, action) {
      handleApiResult(state, action);
      const data = action.payload.data;
      const serverId = action.payload.serverId;
      const newServerName = action.payload.serverName;
      if(data.status == 'success') {
        const serverIndex = state.servers.findIndex(server => server.id === serverId);
        if (serverIndex !== -1) {
          state.servers[serverIndex].name = newServerName;
        }
      }

    }
  },
});

export const { setServers, setLoading, addServer, setSuccess, setDeleteServer, setUpdatedServer } = serversSlice.actions;
export default serversSlice.reducer;
