import { addMessage, setChatProperty, setChatRoomId, setChats } from "../redux/features/chat/chat-slice"
import { store } from "../redux/store"
import { addCommonProps, socketInstance } from "./core-providers-di"



let roomId;
let newMessage;
export const createPublicRoom = (data) => {
    socketInstance.emit('create_public_room', data);
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



export const watchChats = () => {
    socketInstance.on('public_message_response', (data) => {
        console.log('public_message_response', data)
        // join a room
        if(data?.operation === 'join_public_room') {
            store.dispatch(setChats({
                data, 
                room_id: roomId
            }))
        } else if(data?.operation === 'send_message'){
            store.dispatch(addMessage({
                data,
                newMessage
            }))
        } else if(data?.operation === 'create_public_room') {
            if(data.status == 'success') {
                let public_room_id = data.data._id;
                if(public_room_id){
                    joinPublicRoom(data.data._id);
                }
            }
        }
    })

}

export const watchPublicChats = () => {
    socketInstance.on('public_room_response', (data) =>{
        console.log('public_room_response', data)
        if(data.operation === 'create_public_room') {
            
        }
    })
}