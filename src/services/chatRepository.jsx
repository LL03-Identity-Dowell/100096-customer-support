import { addMessage, setChatProperty, setChatRoomId, setChats } from "../redux/features/chat/chat-slice"
import { store } from "../redux/store"
import { addCommonProps, socketInstance } from "./core-providers-di"



let roomId;
let newMessage;
export const createPublicRoom = (data) => {
    socketInstance.emit('create_public_room', {
        ...data,
        workspace_id: '6385c0f18eca0fb652c94558',
        api_key: '1b834e07-c68b-4bf6-96dd-ab7cdc62f07f',
        product: 'customer_support'
    })
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
        if(data?.operation === 'send_message') {
            store.dispatch(setChats({
                data, 
                room_id: roomId
            }))
        } else {
            store.dispatch(addMessage({
                data,
                newMessage
            }))
        }
    })

    socketInstance.on('public_room_response', (data) =>{
        if(data.operation === 'create_public_room') {
            // set to store
        }
    })
}