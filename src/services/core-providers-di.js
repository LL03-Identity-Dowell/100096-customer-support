import {io} from 'socket.io-client'
import axios from 'axios';
import { store } from '../redux/store';
import { markUsedUsers, setUser, setUserProperty } from '../redux/features/auth/user-slice';
// const SocketURL = process.env.NODE_ENV === 'production' ? undefined : 'http://localhost:4000';


const SocketURL =  'https://www.dowellchat.uxlivinglab.online/';

export const socketInstance = io(SocketURL);


export const cleanupSocket = () => {
    socketInstance.off('server_response');
    socketInstance.off('category_response');
    socketInstance.off('channel_response');
    socketInstance.off('public_room_response');
    socketInstance.off('public_message_response');
    socketInstance.off('master_link_response');
    socketInstance.off('new_public_room')
}

export const getAuthReq = async () => {
    let product = 'customer_support';
    let org_id = getOrgId();
    let api_key = await getApiKey(org_id);
    let user_id = getUserId();
    let usernames = await getUsernames();
    
    console.log("usernames", usernames)
    setUserData({product, org_id, api_key, user_id, usernames});

    return {
        product,
        org_id,
        api_key,
        user_id
    }
}

export const setUserData = (data) => {
    store.dispatch(setUser(data));
}

export const generatePublicLinks = (usernames, count, category_id) => {
    let product = store.getState().user.product;
    let org_id = store.getState().user.workspace_id;
    let api_key = store.getState().user.api_key;
    let public_links = []
    const baseurl = 'https://ll03-identity-dowell.github.io/100096-customer-support/#?'
    let shuffledAndUnusedUsers = [...usernames]
        .filter(username => !username.isUsed) 
        .sort(() => Math.random() - 0.5);

    shuffledAndUnusedUsers = shuffledAndUnusedUsers.slice(0, count);

    shuffledAndUnusedUsers.forEach(username => {
        let curr = `${baseurl}type=public_chat&public_link_id=${username?.username}&org_id=${org_id}&category_id=${category_id}&product=${product}&api_key=${api_key}`;
        public_links.push({'link':curr})

    });

    store.dispatch(setUserProperty({
        propertyName: 'public_links',
        value: public_links
    }))

    // mark usernames used
    const usedUsernames = shuffledAndUnusedUsers.map(user => user.username)
    store.dispatch(markUsedUsers(usedUsernames))
    markUserNamesUsedAPI(usedUsernames);

    return public_links;
}

export const addCommonProps = (payload) => {
    let product = store.getState().user.product;
    let org_id = store.getState().user.workspace_id;
    let api_key = store.getState().user.api_key;
    let user_id = store.getState().user.user_id;
    return {
        ...payload,
        workspace_id: org_id,
        api_key,
        product,
        user_id
    };
}

const getOrgId = () => {
    const currUser = JSON.parse(sessionStorage.getItem('cust-user'));
    const org_id = currUser['portfolio_info'][0]?.org_id;
    return org_id;
}

const getApiKey = async (workspace_id) => {
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
    let username;
    let portfolio_code;
    await axios
    .post("https://100093.pythonanywhere.com/api/userinfo/", {
      session_id: store.getState().user.session_id,
    })
    .then((response) => {
        console.log("response data", response.data)
      const filteredUserportfolio =
        response.data.selected_product?.userportfolio.filter(
          (portfolio) =>
            portfolio.product === "Dowell Customer Support Centre" &&
            portfolio.member_type === "public"
        );

        if (filteredUserportfolio && filteredUserportfolio.length > 0) {
            // Find the portfolio with the highest username count
            const portfolioWithMaxUsernames = filteredUserportfolio.reduce(
              (maxPortfolio, currentPortfolio) =>
                currentPortfolio.username.length > maxPortfolio.username.length
                  ? currentPortfolio
                  : maxPortfolio,
              filteredUserportfolio[0]
            );
      
            // Extract usernames from the portfolio with the highest count
            usernames.push(...portfolioWithMaxUsernames.username);      
            portfolio_code = portfolioWithMaxUsernames?.["portfolio_code"];
          } else {
            console.log("No portfolios found matching the criteria");
          }

      currUser = filteredUserportfolio;
      username = response.data?.userinfo?.["username"];
    })
    .catch((error) => {
      console.error("get usernames:", error);
    });


    let userObjects = usernames.map(username => {
        return { username: username, isUsed: false };
      });

    store.dispatch(setUserProperty({
        propertyName: 'username',
        value: username 
    }))

    store.dispatch(setUserProperty({
        propertyName: 'portfolio_code',
        value: portfolio_code
    }))

    return userObjects;
}


const markUserNamesUsedAPI = (usernames) => {
    let baseurl = `https://100093.pythonanywhere.com/api/remove_public_usernames/`

    const data = {
        org_id: store.getState().user.workspace_id,
        product: "Dowell Customer Support Centre",
        username: store.getState().user.username,
        session_id: store.getState().user.session_id,
        usernames,
        portfolio_code: store.getState().user.portfolio_code,
      };

    console.log("usernames data", data)

    axios.post(baseurl, data)
      .then(response => {
        console.log('Set usernames used response:', response.data);
      })
      .catch(error => {
        console.error('set usernames used:', error);
      });
      
}