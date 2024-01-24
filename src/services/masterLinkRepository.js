import { setMasterLink, setMasterProperty } from "../redux/features/chat/master-slice"
import { setSuccess } from "../redux/features/chat/servers-slice"
import { store } from "../redux/store"
import { socketInstance } from "./core-providers-di"
import { addCommonProps } from "./core-providers-di"

export const createMasterLink = (data) => {
    console.log(data)
    store.dispatch(setMasterProperty({propertyName: 'success', value: false}))
    socketInstance.emit('create_master_link', addCommonProps({
        ...data
    }))
}


export const watchMasterLink = (data) => {

    socketInstance.on('master_link_response', (data) => {
        if(data?.operation === 'create_master_link') {
            store.dispatch(setMasterLink(data))         
        } 
    })
}