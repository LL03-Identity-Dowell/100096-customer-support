import { addCommonProps, socketInstance } from "./core-providers-di.js";
import { store } from '../redux/store.js'
import { addServer, setLoading, setServers, setSuccess, setDeleteServer, setUpdatedServer } from "../redux/features/chat/servers-slice.js";

let rightClickedServerId;
let updatedServerName;
let user_id = store.getState().user.user_id;

let serverName;
export function getUserServers () {
    store.dispatch(setLoading(true))
    socketInstance.emit('get_user_servers', addCommonProps({
        user_id
    }));
}

export function createServer (data) {
    store.dispatch(setSuccess(false));
    serverName = data.name;
    socketInstance.emit('create_server', addCommonProps(data))
}

export function deleteServer(serverId) {
    rightClickedServerId = serverId;
    store.dispatch(setSuccess(false));
    socketInstance.emit('delete_server', addCommonProps({ server_id: serverId }));
}

export function editServer(data) {
    rightClickedServerId = data.server_id;
    updatedServerName = data.name;
    store.dispatch(setSuccess(false));
    socketInstance.emit('update_server', addCommonProps(data))
}

export function watchServers () {
    socketInstance.on('server_response', (data) => {
        console.log("server_response", data)
        if(data.operation === 'get_user_servers'){
            store.dispatch(setServers(data))
        }else if(data.operation === 'create_server') {
            store.dispatch(addServer({
                data,
                name: serverName
            }))
        }else if(data.operation === 'delete_server') {
            store.dispatch(setDeleteServer({
                data, 
                serverId: rightClickedServerId
            }))
        }else if(data.operation === 'update_server') {
            store.dispatch(setUpdatedServer({
                data,
                serverId: rightClickedServerId,
                serverName: updatedServerName
            }))
        }
  })
}


