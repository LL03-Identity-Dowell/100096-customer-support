import { createSlice } from "@reduxjs/toolkit";


export const masterSlice = createSlice({
    name: 'masterlink',
    initialState: {
        isLoading: true,
        isError: false,
        success: false,
        error: '',
        masterdata: [],
        masterLinks: []
    },
    reducers: {
        setMasterLink(state, action){
            let data = action.payload;
            if(data.status == 'success') {
                let qrcodes = data.data.qrcodes;
                qrcodes?.forEach(qrcode => {
                    state.masterdata.push(qrcode)
                    state.masterLinks.push(qrcode?.masterlink)
                });
                state.isLoading = false;
                state.success = true;
                state.error = '';
                state.isError = false; 
            } else {
                state.isLoading = false;
                state.success = false;
                state.error = data.data;
                state.isError = true; 

            }
            
        },

        setMasterProperty(state, action) {
            let propertyName = action.payload.propertyName;
            let value = action.payload.value;
            state[propertyName] = value;
        }
    }
})

export const {setMasterLink, setMasterProperty} = masterSlice.actions;
export default masterSlice.reducer;