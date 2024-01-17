import { addChannel, setChannelsLoading, setProperty, setServerChannels, setServerId } from "../redux/features/chat/channels-slice";
import { store } from '../redux/store.js'
import { addCommonProps, socketInstance } from "./core-providers-di.js";

var server_id;
var newChannel = {};
export const getServerChannels = (serverId) => {
    store.dispatch(setChannelsLoading({server_id: serverId, value: true}))
    store.dispatch(setServerId({server_id: serverId}))
    socketInstance.emit('get_server_channels', addCommonProps({ server_id: serverId}));
    server_id = serverId;
}


export const createChannel = (channelData) => {
    newChannel = channelData;
    store.dispatch(setProperty({
        propertyName:'success',
        value: false,
        server_id: server_id
    }))
    socketInstance.emit('create_channel', addCommonProps(channelData));
}

export const watchChannels = () => {
    socketInstance.on('channel_response', (data) => {
        // console.log('channel_response', data)
        if(data.operation === 'get_server_channels'){
            store.dispatch(setServerChannels({
                data,
                server_id
            }));
        }else if(data.operation === 'create_channel'){
            // store.dispatch(addChannel({
            //     data,
            //     newChannel
            // }))
        }
      })
}
