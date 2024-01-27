import { useSelector } from "react-redux";
import { FiCopy } from 'react-icons/fi';
import { useEffect, useState } from "react";

const MasterLinkView = ({toggleModals}) => {

    const masterlink = useSelector((state) => state.masterlink);
    const [link, setLink] = useState([]);
    
    useEffect(() => {
        if(masterlink && masterlink.masterLinks){
            setLink(masterlink.masterLinks?.slice(-1)[0])
        }
    }, [masterlink, masterlink?.masterLinks])


    return (
        <div className="py-3 px-3 lg:px-8 bg-[#080F18] text-white shadow-lg shadow-gray-800 rounded-md w-full">

            <h5 className='mt-6 text-xl font-semibold text-black dark:text-white'>List of Master Links</h5>
            <p className='dark:text-gray-100 text-slate-400 mb-4 text-xs'>This are a list of master links available for this channel, share them and help our customers! </p>
            
            {
                link && (
                    <li className="flex items-center space-x-2">
                        <span className="flex-grow">{link}</span>
                        <button
                        onClick={() =>  navigator.clipboard.writeText(link)}
                        className="flex items-center px-2 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none"
                        >
                        <FiCopy className="mr-1" />
                        Copy
                        </button>
                    </li>
                )
            }

            {/* <button type="submit" 
                onClick={() => toggleModals('createMasterLink', true)}
                className={`py-2 px-5 my-6 inline-block tracking-wide border align-middle duration-500 text-base text-center rounded-md w-full 
                ${false ? 'bg-gray-300' : 'bg-[#0B141F] text-white hover:bg-transparent hover:text-[#0B141F] dark:bg-[#E9E9E9] dark:text-black dark:hover:bg-transparent dark:hover:text-[#E9E9E9]'}`}>
                Create New Masterlink
            </button> */}
        </div>
    );
}


export default MasterLinkView;