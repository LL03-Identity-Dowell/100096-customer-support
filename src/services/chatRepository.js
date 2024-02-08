import { addRoom, setCategoriesProperty, setCurrRoomName, setRoomName, setRoomNameSuccess } from "../redux/features/chat/category-slice";
import { addMessage, setChatProperty, setChatRoomId, setChats, setPublicChatRoom, setPublicRoomProperty } from "../redux/features/chat/chat-slice"
import { AddNewNotificationRoom, AddNotification, setRoomRead } from "../redux/features/chat/notification-slice";
import { store } from "../redux/store"
import { addCommonProps, socketInstance } from "./core-providers-di"



let roomId;
let newMessage;
let editRoomNameId;
export const createPublicRoom = (data) => {
    socketInstance.emit('create_public_room', data);
}

export const setPublicRoomDisplayName = (data) => {
    editRoomNameId = data.room_id;
    store.dispatch(setRoomNameSuccess({
        propertyName: 'roomNameSuccess',
        value: false,
    }))
    socketInstance.emit('set_public_room_display_name', addCommonProps({
        ...data
    }))
}

export const joinPublicRoom = (room_id) => {
    store.dispatch(setChatProperty({
        propertyName: 'isLoading',
        room_id: room_id,
        value: true
    }))
    store.dispatch(setChatRoomId({
        room_id: room_id
    }))
    socketInstance.emit('public_join_room', addCommonProps({
        room_id
    }));
    roomId = room_id;
}

export const sendMessage = (data) => {
    newMessage = data;
    store.dispatch(setChatProperty({
        propertyName: 'isSendingMessage',
        room_id: data.room_id,
        value: true
    }))
    socketInstance.emit('public_message_event', addCommonProps(data))
}

export const autoJoinRoom = () => {
    socketInstance.emit('auto_join_room', addCommonProps());
}


export const watchChats = () => {
    socketInstance.on('public_message_response', (data) => {
        console.log('public_message_response', data)
        // join a room
        if(data?.operation === 'join_public_room') {
            // set messages read
            store.dispatch(setCurrRoomName(roomId))
            if(data.status == 'success') {
                store.dispatch(setRoomRead(data))
            }
            store.dispatch(setChats({
                data, 
                room_id: roomId
            }))
        } else if(data?.operation === 'send_message'){
            if(data.status == 'success' && store.getState().user.isLoggedIn && store.getState().user.user_id != data?.data?.author) {
                store.dispatch(AddNotification(data))
            }
            store.dispatch(addMessage({
                data,
                newMessage
            }))
        } else if(data?.operation === 'create_public_room') {
            store.dispatch(setPublicRoomProperty({
                propertyName: 'publicRoomLoading',
                value: false
            }))
            store.dispatch(setChatRoomId({
                room_id: data.room_id
            }))
            store.dispatch(setPublicChatRoom({
                data,
            }))
        }
    })

}

export const watchPublicChats = () => {
    socketInstance.on('public_room_response', (data) =>{
        console.log('public_room_response', data)
        if(data.operation === 'create_public_room') {
            store.dispatch(setPublicRoomProperty({
                propertyName: 'publicRoomLoading',
                value: false
            }))
            store.dispatch(setChatRoomId({
                room_id: data.data._id
            }))
        }else if(data.operation == 'set_display_name'){
            store.dispatch(setRoomNameSuccess({
                propertyName: 'roomNameSuccess',
                value: true,
            }))
            store.dispatch(setRoomName({
                data,
                room_id: editRoomNameId
            }))
        }
    })
}

export const watchNewPublicRoom = () => {

    socketInstance.on('new_public_room', (data) => {
        console.log('new_public_room', data)
        store.dispatch(addRoom(data)); 
        store.dispatch(AddNewNotificationRoom(data));
        // join the room
        // if(data.status == 'success') {
        //     let room_id = data.data._id;
        //     socketInstance.emit('public_join_room', addCommonProps({
        //         room_id
        //     }));
        // }
    })
}