import {io} from 'socket.io-client'
import axios from 'axios';
// const SocketURL = process.env.NODE_ENV === 'production' ? undefined : 'http://localhost:4000';

export let USER_ID;
let product;
let org_id;
let api_key;
const SocketURL =  'https://www.dowellchat.uxlivinglab.online/';

export const socketInstance = io(SocketURL);


export const cleanupSocket = () => {
    socketInstance.off('server_response');
    socketInstance.off('category_response');
    socketInstance.off('channel_response');
    socketInstance.off('public_room_response');
    socketInstance.off('public_message_response');
}

export const getAuthReq = async () => {
    product = 'customer_support';
    org_id = getOrgId();
    api_key = await getApiKey(org_id);
    USER_ID = getUserId();

    return {
        product,
        org_id,
        api_key,
        USER_ID
    }
}

export const addCommonProps = (payload) => {
    return {
        ...payload,
        workspace_id: org_id,
        api_key,
        product,
        user_id: USER_ID
    };
}

const getOrgId = () => {
    const currUser = JSON.parse(sessionStorage.getItem('cust-user'));
    const org_id = currUser['portfolio_info'][0]?.org_id;
    return org_id;
}
const getApiKey = async (workspace_id) => {
    // https://100105.pythonanywhere.com/api/v3/user/?type=get_api_key&workspace_id=type workspace id 
    const URL = `https://100105.pythonanywhere.com/api/v3/user/?type=get_api_key&workspace_id=${workspace_id}`
    let api_key;
    await axios.get(URL).then((response) => {
        const data = response.data
        if(data.success == true){
            api_key = data.data['api_key'];
        }
    }).catch((err) => {
        console.log('get_api_key', err)
    })

    return api_key;
}

const getUserId = () => {
    const currUser = JSON.parse(sessionStorage.getItem('cust-user'));
    const user_id = currUser['userinfo'].userID;
    return user_id;
}