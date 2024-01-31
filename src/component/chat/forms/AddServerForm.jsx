import {Form, useForm} from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import FormInput from '../../common/FormInput';
import { createServer } from '../../../services/serverRepository';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

const schema = yup.object().shape({
    name:  yup.string().required("Please enter your valid server name").min(5, "Server name should be longer than 5 characters"),
})

const AddServerForm = ({toggleModals}) => {

    const {user_id} = useSelector((state) => state.user);
    const {success, isError, error} = useSelector((state) => state.servers);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const { register, handleSubmit, formState: {errors} } = useForm({
        resolver: yupResolver(schema)
    });

    const onSubmit = (_data) => {
        setIsSubmitted(true);
        const data = {
            name: _data?.name,
            member_list: [user_id],
            channels: [],
            events: [],
            owner: user_id,
            created_at: Date.now()
        }
        createServer(data);
    }

    useEffect(() => {
        if(success && isSubmitted) {
            toast.success("Server Created!")
            toggleModals('showAddServerModal', false);
        }
    }, [isSubmitted, success])

    return (
        <div className="py-3 px-3 lg:px-8 bg-white dark:bg-[#080F18] shadow-lg dark:shadow-gray-800 rounded-md w-full">
            {
                isError && (
                    <p className="mt-2 text-xs text-red-600 dark:text-red-500">{error.toString()}</p>
                )
            }
            <h5 className='mt-6 text-xl font-semibold text-black dark:text-white'>Create Server</h5>
            <p className='dark:text-gray-100 text-slate-400 mb-4 text-xs'>Your server is where you and your friends hang out. Make yours and start talking.</p>

            <form onSubmit={handleSubmit(onSubmit)}>

                <FormInput
                    name='name'
                    typeof='text'
                    id='name'
                    placeholder='server name'
                    register={{...register('name')}}
                    error={errors.name?.message}
                />
                
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


export default AddServerForm;