import {Form, useForm} from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import FormInput from '../../common/FormInput';
import { CiHashtag } from "react-icons/ci";
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { createCategory } from '../../../services/catagoryRepository';
import { toast } from 'react-toastify';


const schema = yup.object().shape({
    name:  yup.string().required("Please enter your valid server name").min(5, "Server name should be longer than 5 characters"),
})

const CreateCategoryForm = ({toggleModals}) => {

    const {user_id} = useSelector((state) => state.user);
    const server_id = useSelector((state) => state.categories.server_id);
        const categoryServers = useSelector((state) => {
            const serverId = state.categories.server_id;
            return state.categories[serverId];
        })
        const [isSubmitted, setIsSubmitted] = useState(false);
        const { register, handleSubmit, formState: {errors}, setValue, getValues } = useForm({
            resolver: yupResolver(schema),
            defaultValues: { privateChannel : false} 
        });
    
        const onSubmit = (_data) => {
            const data = {
                name: _data?.name,
                rooms: [],
                member_list: [user_id],
                private: _data?.privateChannel,
                server_id,
                created_at: Date.now()
            }
            createCategory(data);
            setIsSubmitted(true);
        }
    
        useEffect(() => {
            const success = categoryServers?.success
            if( success == true && isSubmitted) {
                toast.success("Category Created!")
                toggleModals('categoryModal', false)
            }
        }, [isSubmitted, categoryServers?.success])
    
        return (
            <div className="py-3 px-3 lg:px-8 bg-[#080F18] text-white shadow-lg shadow-gray-800 rounded-md w-full">
                {
                    categoryServers?.isError && (
                        <p className="mt-2 text-xs text-red-600 dark:text-red-500">{categoryServers?.error}</p>
                    )
                }
                <h5 className='mt-6 text-xl font-semibold text-black dark:text-white'>Create Category</h5>
    
                <form onSubmit={handleSubmit(onSubmit)} className='text-white'>
    
                    <FormInput
                        name='name'
                        type='text'
                        id='name'
                        placeholder='category name'
                        register={{...register('name')}}
                        error={errors.name?.message}
                    />
    
                    <label className='px-3 py-6'  htmlFor="private_channel">
                        <div className='flex justify-between'>
                            <p className='text-lg'>Private Channel</p>
                            <div>
                                <label className="relative inline-flex items-center me-5 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        {...register('privateChannel', { defaultValue: false })}
                                        onChange={(e) => {
                                            setValue('privateChannel', e.target.checked);
                                        }}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-focus:ring-4 peer-focus:ring-green-300 dark:peer-focus:ring-green-800 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-600"></div>
                                    <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">Green</span>
                                </label>
                            </div>
                        </div>
                        <span>Only selected members and roles will be able to view this category.</span>
                    </label>
                    
                    <button
                    type="submit"
                    disabled={isSubmitted}
                    className={`py-2 px-5 my-6 inline-block tracking-wide border align-middle duration-500 text-base text-center rounded-md w-full 
                        ${isSubmitted ? 'bg-gray-300 cursor-not-allowed' : 'bg-[#0B141F] text-white hover:bg-transparent hover:text-[#0B141F] dark:bg-[#E9E9E9] dark:text-black dark:hover:bg-transparent dark:hover:text-[#E9E9E9]'}`}
                    >
                    {isSubmitted ? (
                        <div className="flex justify-center items-center">
                        <div className="animate-spin h-5 w-5 border-t-2 border-[#0B141F] rounded-full"></div>
                        </div>
                    ) : (
                        'Submit'
                    )}
                </button>
                </form>
            </div>
        );
}


export default CreateCategoryForm;