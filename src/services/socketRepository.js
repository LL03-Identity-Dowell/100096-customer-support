import { socketInstance } from "./core-providers-di"

function socketState () {
    return {
        'isConnected': socketInstance.connected,
        'isDisconnected': socketInstance.disconnected
    }
}

function disconnect (){
    socketInstance.disconnect();
}
