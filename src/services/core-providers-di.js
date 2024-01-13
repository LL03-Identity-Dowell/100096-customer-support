import {io} from 'socket.io-client'
import axios from 'axios';
// const SocketURL = process.env.NODE_ENV === 'production' ? undefined : 'http://localhost:4000';

export const USER_ID = 'chidiebere';
let product;
let org_id;
let api_key;
const SocketURL =  'http://www.dowellchat.uxlivinglab.online/';


export const socketInstance = io(SocketURL);

export const getAuthReq = async () => {
    product = 'customer_support';
    org_id = getOrgId();
    api_key = await getApiKey(org_id);

    return {
        product,
        org_id,
        api_key
    }
}

export const addCommonProps = (payload) => {
    return {
        ...payload,
        workspace_id: org_id,
        api_key,
        product
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