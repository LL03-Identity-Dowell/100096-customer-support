import { markUsedUsers } from "../redux/features/auth/user-slice"
import { setMasterLink, setMasterProperty } from "../redux/features/chat/master-slice"
import { setSuccess } from "../redux/features/chat/servers-slice"
import { store } from "../redux/store"
import { socketInstance } from "./core-providers-di"
import { addCommonProps } from "./core-providers-di"

export const createMasterLink = (data) => {
    store.dispatch(setMasterProperty({propertyName: 'success', value: false}))
    store.dispatch(setMasterProperty({propertyName: 'isLoading', value: true}))

    socketInstance.emit('create_master_link', addCommonProps({
        ...data
    }))
}

// export const getUsedUsernames = () => {
//     socketInstance.emit('get_used_usernames', addCommonProps())
// }


export const watchMasterLink = () => {

    socketInstance.on('master_link_response', (data) => {
        console.log('master_link_response', data)
        if(data?.operation === 'create_master_link') {
            store.dispatch(setMasterLink(data))         
        }else if(data?.operation === 'get_used_usernames') {
            // if(data.status === 'success') {
            //     store.dispatch(markUsedUsers(data?.data[0]?.["public_username"]))
            // }
        }
    })
}
