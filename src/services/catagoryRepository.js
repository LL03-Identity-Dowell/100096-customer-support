import { addCategory, setCategories, setCategoriesProperty, setCategoriesServerId } from "../redux/features/chat/category-slice"
import { store } from "../redux/store"
import { addCommonProps, socketInstance } from "./core-providers-di"


let server_id;
let newCategory;
export const getServerCategory = (serverId) => {
    store.dispatch(setCategoriesProperty({
        propertyName: 'isLoading',
        server_id: serverId,
        value: true
    }))
    store.dispatch(setCategoriesServerId({
        server_id: serverId
    }))
    socketInstance.emit('cs_get_server_category', addCommonProps({server_id: serverId}))

    server_id = serverId;
}

export const createCategory = (categoryData) => {
    newCategory = categoryData;
    store.dispatch(setCategoriesProperty({
        propertyName: 'success',
        value: false,
        server_id
    }))
    socketInstance.emit('cs_create_category', addCommonProps(categoryData))
}

export const watchCategory = () => {

    socketInstance.on('category_response', (data) => {
        console.log('category_response', data)
        if(data.operation == 'get_server_category'){
            store.dispatch(setCategories({
                data,
                server_id
            }))
        }else if(data.operation == 'create_category'){
            store.dispatch(addCategory({
                data,
                newCategory,
            }))
        }
    })
}