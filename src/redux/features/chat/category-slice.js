import { createSlice } from "@reduxjs/toolkit"


const _initialState = {
    server_id : null
}   
const handleApiResult = (state, action) => {
    const data = action.payload.data;
    let server_id = action.payload.server_id;
  
    if (data.status == 'success') {
        state[server_id].isLoading = false;
        state[server_id].success = true;
        state[server_id].isError = false;
        state[server_id].error = '';
    } else {
        state[server_id].isLoading = false;
        state[server_id].success = false;
        state[server_id].isError = true;
        state[server_id].error = data.data;
    }
  };

export const categorySlice = createSlice({
    name: 'categories',
    initialState: _initialState,
    reducers: {
        setCategories(state, action) {
            let data = action.payload.data;
            let server_id = action.payload.server_id;

            if(!state.hasOwnProperty(server_id)){
                state[server_id] = {}
            }
            handleApiResult(state, action)

            if (data.status == 'success') {
                state[server_id].categories = data.data;
            } else {
                state[server_id].categories = [];
            }
        },
        addCategory(state, action) {
            let data = action.payload.data;
            let newCategory = action.payload.newCategory;
            let server_id = state.server_id;
            
            if(!server_id){
                return;
            }
            handleApiResult(state,action)
            if (data.status == 'success') {
                state[server_id].categories.push({
                    name: newCategory.name,
                    id: data.inserted_id
                })
            } else {
                state[server_id].categories = state[server_id].categories;
            }

        },

        addRoom(state, action){
            let data = action.payload.data;
            let category_id = action.payload.category_id;
            let server_id = action.payload.server_id;

            if(!state[server_id]){
                state[server_id] = {}
            }           
            
        },  

        setCategoriesProperty(state, action) {
            let propertyName = action.payload.propertyName;
            let value = action.payload.value;
            let server_id = action.payload.server_id

            if (!state[server_id]) {
                state[server_id] = {};
              }
            
            if (state[server_id] && typeof state[server_id] === 'object') {
            state[server_id][propertyName] = value;
            }
        },

        setCategoriesServerId(state, action){
            let server_id = action.payload.server_id;
            state.server_id = server_id;
        }
    }
})


export const {setCategories, setCategoriesProperty, setCategoriesServerId, addCategory} = categorySlice.actions;
export default categorySlice.reducer;