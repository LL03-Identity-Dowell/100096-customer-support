import { setNotifications } from "../redux/features/chat/notification-slice"
import { store } from "../redux/store"
import { socketInstance } from "./core-providers-di"




export const watchNotifications = () => {

    socketInstance.on('auto_join_response', (data) => {
        if(data.operation == 'auto_join_room'){
            store.dispatch(setNotifications(data));
        }
    })
}