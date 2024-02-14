import { createSlice } from "@reduxjs/toolkit";

const _initialState = {
    public_links: [],
    usernames: [],
    user_id: null,
    session_id: null,
    workspace_id: null,
    api_key: null,
    product: 'customer_support',
    username: '',
    portfolio_code: null,
    isLoggedIn: false,
    link_id: null
}

const handleApiResult = (state, action) => {
    const data = action.payload;
  
    if (data.status === "success") {
      state.isLoading = false;
      state.success = true;
      state.isError = false;
      state.error = "";
    } else {
      state.isLoading = false;
      state.isError = true;
      state.error = data.data;
      state.success = false;
    }
  };
  

export const userSlice = createSlice({
    name: 'user',
    initialState: _initialState,
    reducers: {
        setUserProperty(state, action){
            let propertyName = action.payload.propertyName;
            let value = action.payload.value;

            state[propertyName] = value;
        },
        setUser(state, action) {
            let data = action.payload;

            handleApiResult(state, action);
            state.api_key = data.api_key;
            state.user_id = data.user_id;
            state.usernames = data?.usernames;
            state.workspace_id = data.org_id;
            state.product = data.product;
            state.link_id = data.link_id
        },
        markUsedUsers(state, action) {
          let usedUsernames = action.payload
          state.usernames.forEach(user => {
            if(usedUsernames.includes(user.username)) {
              user.isUsed = true;
            }
          })
        }
    }
})

export const {setUserProperty, setUser, markUsedUsers} = userSlice.actions;
export default userSlice.reducer;