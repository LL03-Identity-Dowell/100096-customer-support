import { socketInstance } from "./core-providers-di.js";
import { USER_ID } from "./core-providers-di.js";
import { store } from '../redux/store.js'
import { addServer, setLoading, setServers, setSuccess } from "../redux/features/chat/servers-slice.js";

let serverName;
export function getUserServers () {
    store.dispatch(setLoading(true))
    socketInstance.emit('get_user_servers', {
        user_id : USER_ID
    });
}

export function createServer (data) {
    store.dispatch(setSuccess(false));
    serverName = data.name;
    socketInstance.emit('create_server', data)
}


export function watchServers () {
    socketInstance.on('server_response', (data) => {
        if(data.operation === 'get_user_servers'){
            store.dispatch(setServers(data))
        }else if(data.operation === 'create_server') {
            store.dispatch(addServer({
                data,
                name: serverName
            }))
        }
  })
}


