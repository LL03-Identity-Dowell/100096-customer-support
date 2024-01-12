import { socketInstance } from "./core-providers-di.js";
import { USER_ID } from "./core-providers-di.js";
import { store } from '../redux/store.js'
import { addServer, setLoading, setServers, setSuccess, setDeleteServer, setUpdatedServer } from "../redux/features/chat/servers-slice.js";

let rightClickedServerId;
let updatedServerName;

export function getUserServers () {
    store.dispatch(setLoading(true))
    socketInstance.emit('get_user_servers', {
        user_id : USER_ID
    });
}

export function createServer (data) {
    store.dispatch(setSuccess(false));
    socketInstance.emit('create_server', data)
}

export function deleteServer(serverId) {
    rightClickedServerId = serverId;
    store.dispatch(setSuccess(false));
    socketInstance.emit('delete_server', { server_id: serverId });
}

export function editServer(data, serverId) {
    rightClickedServerId = serverId;
    updatedServerName = data.name;
    store.dispatch(setSuccess(false));
    socketInstance.emit('update_server', data)
}

export function watchServers () {
    socketInstance.on('server_response', (data) => {
        if(data.operation === 'get_user_servers'){
            store.dispatch(setServers(data))
        }else if(data.operation === 'create_server') {
            store.dispatch(addServer({
                data,
                name: 'HardCoded'
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


