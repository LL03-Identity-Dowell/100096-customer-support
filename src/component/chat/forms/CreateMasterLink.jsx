import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import {useForm, Controller} from 'react-hook-form';
import { generatePublicLinks } from "../../../services/core-providers-di";
import { createMasterLink } from "../../../services/masterLinkRepository";
import { toast } from "react-toastify";

const CreateMasterLink = ({toggleModals}) => {

    const {success, isError, error, isLoading} = useSelector((state) => state.masterlink)
    const user = useSelector((state) => state.user);
    const category_id = useSelector((state) => state.categories.category_id)
    
    const { control, handleSubmit } = useForm();
    const [isSubmitted, setIsSubmitted] = useState(false);

    const onSubmit = (data) => {        
        let count = data.selectedNumber;
        let public_links = generatePublicLinks(user.usernames, count, category_id);
        let job_name = 'customer_support';
        createMasterLink({
            links: public_links,
            job_name
        })
        setIsSubmitted(true);
    }

    useEffect(() => {
        if(success && isSubmitted) {
            toast.success("Master Link Created!")
            toggleModals('createMasterLink', false);
            toggleModals('masterLinkView', true);
            setIsSubmitted(false);
        }
    }, [isSubmitted, success])

    return (
        <div className="py-3 px-3 lg:px-8 bg-white dark:bg-[#080F18] shadow-lg dark:shadow-gray-800 rounded-md w-full">
        {
            isError && (
                <p className="mt-2 text-xs text-red-600 dark:text-red-500">{error}</p>
            )
        }
        {
            user.usernames.filter(user => !user.isUsed).length == 0 && (
                <p className="mt-2 text-xs text-red-600 dark:text-red-500">You have used all your usernames!</p>
                )
        }
        <h5 className='mt-6 text-xl font-semibold text-black dark:text-white'>Create Master Links</h5>
        <p className='dark:text-gray-100 text-slate-400 mb-4 text-xs'>Please select public links to create master links from.</p>

        <form onSubmit={handleSubmit(onSubmit)} className="text-white">

            <label className="block text-sm font-bold mb-2" htmlFor="selectedNumber">
                Select a Number (1 to {user.usernames.filter(user => !user.isUsed).length || 0}):
                </label>
                <Controller
                    name="selectedNumber"
                    control={control}
                    defaultValue={1}
                    render={({ field }) => (
                        <input
                        {...field}
                        type="number"
                        className="border border-gray-300 p-2 w-full text-black"
                        min={1}
                        max={user.usernames.filter(user => !user?.isUsed).length|| 0}
                        step={1}
                        />
                    )}
            />            
            <button
                type="submit"
                disabled={isSubmitted}
                className={`py-2 px-5 my-6 inline-block tracking-wide border align-middle duration-500 text-base text-center rounded-md w-full 
                    ${isSubmitted ? 'bg-gray-300 cursor-not-allowed' : 'bg-[#0B141F] text-white hover:bg-transparent hover:text-[#0B141F] dark:bg-[#E9E9E9] dark:text-black dark:hover:bg-transparent dark:hover:text-[#E9E9E9]'}`}
                >
                {isSubmitted && isLoading ? (
                    <div className="flex justify-center items-center">
                    <div className="animate-spin h-5 w-5 border-t-2 border-[#0B141F] rounded-full"></div>
                    </div>
                ) : (
                    'Submit'
                )}
            </button>

        </form>
    </div>
    )

}


export default CreateMasterLink;