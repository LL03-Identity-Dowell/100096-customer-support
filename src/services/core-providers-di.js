import {io} from 'socket.io-client'
import axios from 'axios';
import { store } from '../redux/store';
import { setUserProperty } from '../redux/features/auth/user-slice';
// const SocketURL = process.env.NODE_ENV === 'production' ? undefined : 'http://localhost:4000';

export let USER_ID;
let product;
let org_id;
let api_key;
let usernames;
const SocketURL =  'https://www.dowellchat.uxlivinglab.online/';

export const socketInstance = io(SocketURL);


export const cleanupSocket = () => {
    socketInstance.off('server_response');
    socketInstance.off('category_response');
    socketInstance.off('channel_response');
    socketInstance.off('public_room_response');
    socketInstance.off('public_message_response');
    socketInstance.off('master_link_response');
}

export const getAuthReq = async () => {
    product = 'customer_support';
    org_id = getOrgId();
    api_key = await getApiKey(org_id);
    USER_ID = getUserId();
    usernames = await getUsernames()

    return {
        product,
        org_id,
        api_key,
        USER_ID
    }
}

export const generatePublicLinks = (usernames, count, category_id) => {
    let public_links = []
    const baseurl = 'https://ll03-identity-dowell.github.io/100096-customer-support/?'
    let shuffledIds = [...usernames].sort(() => Math.random() - 0.5);
    shuffledIds = shuffledIds.slice(0, count);

    shuffledIds.forEach(username => {
        let curr = `${baseurl}type=pulic_chat&public_link_id=${username}&org_id=${org_id}&category_id=${category_id}&product=${product}`;
        public_links.push({'link':curr})

    });

    return public_links;
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


const getUsernames = async () => {
    let currUser;
    let usernames = [];
    await axios
    .post("https://100093.pythonanywhere.com/api/userinfo/", {
      session_id: "usgu9m5zsjdg9xwp8jmzbdkqy4jvd0m0",
    })
    .then((response) => {
      console.log(response.data);
      const filteredUserportfolio =
        response.data.selected_product.userportfolio.filter(
          (portfolio) =>
            portfolio.product === "Dowell Customer Support Centre" &&
            portfolio.member_type === "public"
        );
      currUser = filteredUserportfolio;
      filteredUserportfolio.map((portfolio) => {
        usernames.push(...portfolio.username);
      })
    })
    .catch((error) => {
      console.error("Error:", error);
    });

    
    store.dispatch(setUserProperty({
        propertyName: 'usernames',
        value: usernames
    }))

    return usernames;
}

