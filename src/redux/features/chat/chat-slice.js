import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

const _initialState = {
    room_id : null,
    publicRoomLoading: true
}


const handleApiResult = (state, action) => {
    const data = action.payload.data;
    let room_id = action.payload.room_id;
  
    if (data.status == 'success') {
        state[room_id].isLoading = false;
        state[room_id].success = true;
        state[room_id].isError = false;
        state[room_id].error = '';
    } else {
        state[room_id].isLoading = false;
        state[room_id].success = false;
        state[room_id].isError = true;
        state[room_id].error = data.data;
        toast.error(`${data.data}`)
    }
  };

  
export const chatSlice = createSlice({
    name: 'chats',
    initialState: _initialState,
    reducers: {
        setChats(state, action) {
            let data = action.payload.data;
            let room_id = action.payload.room_id;

            if(!state.hasOwnProperty(room_id)){
                state[room_id] = {}
            }

            if(!state[room_id].hasOwnProperty('messages')){
                state[room_id].messages = []
            }
            handleApiResult(state, action);

            if(data.status == 'success'){
                if (typeof data.data == 'string') {
                    state[room_id].messages = [] 
                } else {
                    state[room_id].messages = data.data
                }
            }
        },
        setChatProperty(state, action){
            let propertyName = action.payload.propertyName;
            let value = action.payload.value;
            let room_id = action.payload.room_id;

            if(!state[room_id]){
                state[room_id] = {}
            }

            if (state[room_id] && typeof state[room_id] === 'object') {
                state[room_id][propertyName] = value;
            }
        },

        setChatRoomId(state, action){
            let room_id = action.payload.room_id;
            state.room_id = room_id;
        },

        addMessage(state, action) {
            let data = action.payload.data;
            let room_id = data?.data?.room_id
            let message = data?.data
            
            if(data.status == 'success') {
                if(!state[room_id]) {
                    state[room_id] = {}
                }
                if(!state[room_id]?.messages) {
                    state[room_id]["messages"] = []
                }
                state[room_id]?.messages.push(message)
                state[room_id]["isSendingMessage"] = false;
                if(state.room_id != room_id) {
                    toast.success(`New Message: ${message?.message_data} in Room ${room_id}`);
                }
            }else {
                toast.error("Message Not Sent! Try Again!")
            }
        },

        setPublicChatRoom(state, action) {
            let data = action.payload.data;
            let room_id = data.room_id;

            if(!state[room_id]){
                state[room_id] = {}
            }
            
            if (data.status == 'success') {
                state[room_id].isLoading = false;
                state[room_id].success = true;
                state[room_id].isError = false;
                state[room_id].error = '';
            } else {
                state[room_id].isLoading = false;
                state[room_id].success = false;
                state[room_id].isError = true;
                state[room_id].error = data.data;
            }

            if(!state[room_id].hasOwnProperty('messages')){
                state[room_id].messages = data.data
            }
        },

        setPublicRoomProperty(state, action) {
            let propertyName = action.payload.propertyName;
            let value = action.payload.value;

            state[propertyName] = value;
        }
    }
})

export const {setChatProperty, setChats, setChatRoomId, addMessage, setPublicChatRoom, setPublicRoomProperty} = chatSlice.actions;
export default chatSlice.reducer;