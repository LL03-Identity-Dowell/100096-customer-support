import { createSlice } from "@reduxjs/toolkit";


export const notificationSlice = createSlice({
    name: 'notifications',
    initialState: {
        'category_server_map' : {},
        'room_category_map' : {}
    },
    reducers: {
        setNotifications(state, action) {
            let data = action.payload;

            if(data.status == 'success'){
                let notifications = data.data;
                
                for(let i = 0; i < notifications?.length; i++) {
                    let serverData = notifications[i];
                    let currentServerId = serverData?.['server_id'];
                    let currentCategories = serverData?.['category']
                    state[currentServerId] = {}
                    state[currentServerId]['count'] = 0

                    for(let j = 0; j < currentCategories?.length; j++) {
                        let currentCategoryId = currentCategories[j]?.['_id'];
                        let currentRooms = currentCategories[j]?.['rooms'];
                        state[currentServerId][currentCategoryId] = {}
                        state[currentServerId][currentCategoryId]['count'] = 0
                        // map category to server
                        state.category_server_map[currentCategoryId] = currentServerId;

                        for(let k = 0; k < currentRooms?.length; k++) {
                            let currentRoomId = currentRooms[k]?.['_id']?.['$oid']
                            let count = currentRooms[k]?.['unread_message']; 
                            state[currentServerId][currentCategoryId][currentRoomId] = count;
                            state[currentServerId][currentCategoryId]['count'] += count
                            state.room_category_map[currentRoomId] = currentCategoryId
                        }

                        state[currentServerId]['count'] += state[currentServerId][currentCategoryId]['count']
                    }

                }
            }
        },

        setRoomRead(state, action) {

            let data = action.payload;
            let notifications = data.data;

            if(!notifications || notifications.length == 0) {
                return
            }
            let currentRoomId = notifications[0]?.['room_id'];
            // console.log("currentRoomId", currentRoomId)
            let currentCategoryId = state.room_category_map[currentRoomId];
            // console.log("currentCategoryId", currentCategoryId)

            if(!currentCategoryId) {
                return
            }
            let currentServerId = state.category_server_map[currentCategoryId];
            // console.log("currentServerId", currentServerId)
            
            let count = state[currentServerId][currentCategoryId][currentRoomId]
            
            
            // update notifications
            state[currentServerId]['count'] -= count;
            state[currentServerId][currentCategoryId]['count'] -= count;
            state[currentServerId][currentCategoryId][currentRoomId] = 0;
        },

        AddNotification(state, action) {
            let data = action.payload;
            let notifications = data.data;
            
            let currentRoomId = notifications?.room_id;
            let currentCategoryId = state.room_category_map[currentRoomId];
            let currentServerId = state.category_server_map[currentCategoryId];
            
            // update notifications        
            if (!state[currentServerId]) {
                state[currentServerId] = {};
                state[currentServerId]['count'] = 0;
            }
        
            state[currentServerId]['count'] += 1;
        
            if (!state[currentServerId][currentCategoryId]) {
                state[currentServerId][currentCategoryId] = {};
                state[currentServerId][currentCategoryId]['count'] = 0;
            }
        
            state[currentServerId][currentCategoryId]['count'] += 1;
        
            if (!state[currentServerId][currentCategoryId][currentRoomId]) {
                state[currentServerId][currentCategoryId][currentRoomId] = 0;
            }
            
            state[currentServerId][currentCategoryId][currentRoomId] += 1;
        },

        AddNewNotificationRoom(state, action) {
            let data = action.payload;

            if(data.status == 'success') {
                let category_id = data.data.category;
                let server_id = data.data.server;
                let room_id = data.data._id;
                  
                if (!state[server_id]) {
                    state[server_id] = {
                        count: 0
                    };
                }
        
                if (!state[server_id][category_id]) {
                    state[server_id][category_id] = {
                        count: 0
                    };
                }

                state[server_id][category_id][room_id] = 0
            }
        }
    }
})

export const {setNotifications, setRoomRead, AddNotification, AddNewNotificationRoom} = notificationSlice.actions;
export default notificationSlice.reducer;