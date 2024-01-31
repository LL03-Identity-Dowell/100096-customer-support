import {Form, useForm} from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import FormInput from '../../common/FormInput';
import { CiHashtag } from "react-icons/ci";
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { PiSpeakerHigh } from "react-icons/pi";
import { createChannel } from '../../../services/channelRepository';


const schema = yup.object().shape({
    name:  yup.string().required("Please enter your valid server name").min(5, "Server name should be longer than 5 characters"),
    channelType: yup.string().required('Please select a channel type').oneOf(['text', 'voice']),
})

const CreateChannelForm = ({toggleModals}) => {

    const {user_id} = useSelector((state) => state.user);
    const server_id = useSelector((state) => state.channels.server_id);
    const serverChannels = useSelector((state) => {
        const serverId = state.channels.server_id;
        return state.channels[serverId];
    })
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [selectedChannelType, setSelectedChannelType] = useState('text');
    const { register, handleSubmit, formState: {errors}, setValue, getValues } = useForm({
        resolver: yupResolver(schema),
        defaultValues: { privateChannel : false, channelType: 'text' } 
    });

    const onSubmit = (_data) => {
        const data = {
            name: _data?.name,
            topic: 'random',
            type: _data?.channelType,
            private: _data?.privateChannel,
            server: server_id,
            member_list: [user_id],
            created_at: Date.now()
        }
        createChannel(data);
        setIsSubmitted(true);
    }

    useEffect(() => {
        const success = serverChannels?.success
        if( success == true && isSubmitted) {
            toggleModals('channelModal', false)
        }
    }, [isSubmitted, serverChannels?.success])

    return (
        <div className="py-3 px-3 lg:px-8 bg-[#080F18] text-white shadow-lg shadow-gray-800 rounded-md w-full">
            {
                serverChannels?.isError && (
                    <p className="mt-2 text-xs text-red-600 dark:text-red-500">{serverChannels?.error}</p>
                )
            }
            <h5 className='mt-6 text-xl font-semibold text-black dark:text-white'>Create Channel</h5>
            <p className='dark:text-gray-100 text-slate-400 mb-4 text-xs'>Your server is where you and your friends hang out. Make yours and start talking.</p>

            <h2 className='font-bold text-base pb-2'>Channel Type</h2>
            <form onSubmit={handleSubmit(onSubmit)} className='text-white'>

                <label className={`${selectedChannelType === 'text' ? 'bg-gray-500' : 'bg-[#080F18]'} mb-2 border border-white/20 px-3 py-6 flex justify-between items-center text-white w-full cursor-pointer`} htmlFor="text_channels">
                    <CiHashtag className='w-10 h-10'/>
                    <div className='text-left'>
                        <p className='text-lg'>Text Channel</p>
                        <span>Send messages, images, GIFs, emoji, opinions, and puns</span>
                    </div>
                    <input
                        id="text_channels"
                        type="radio"
                        name="channelType"
                        value="text"
                        {...register('channelType')}
                        className="w-4 h-4 text-white bg-gray-100 border-gray-300"
                        onClick={() => setSelectedChannelType('text')}
                    />
                </label>

                <label className={`${ selectedChannelType === 'voice' ? 'bg-gray-500' : 'bg-[#080F18]'} border border-white/20 px-3 py-6 flex justify-between items-center text-white w-full cursor-pointer`} htmlFor="voice_channels">
                    <PiSpeakerHigh className='w-10 h-10'/>
                    <div className='text-left'>
                        <p className='text-lg'>Voice Channel</p>
                        <span>Voice Hang out together with voice, video, and screen share</span>
                    </div>
                    <input
                        id="voice_channels"
                        type="radio"
                        name="channelType"
                        value="voice"
                        {...register('channelType')}
                        className="w-4 h-4 text-white bg-gray-100 border-gray-300 "
                        onClick={() => setSelectedChannelType('voice')}
                    />
                </label>

                <FormInput
                    name='name'
                    type='text'
                    id='name'
                    placeholder='channel name'
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
                    <span>Only selected members and roles will be able to view this channel.</span>
                </label>
                
                <button type="submit" 
                    disabled={isSubmitted}
                    className={`py-2 px-5 my-6 inline-block tracking-wide border align-middle duration-500 text-base text-center rounded-md w-full 
                    ${false ? 'bg-gray-300' : 'bg-[#0B141F] text-white hover:bg-transparent hover:text-[#0B141F] dark:bg-[#E9E9E9] dark:text-black dark:hover:bg-transparent dark:hover:text-[#E9E9E9]'}`}>
                    Submit
                </button>
            </form>
        </div>
    );

}


export default CreateChannelForm;