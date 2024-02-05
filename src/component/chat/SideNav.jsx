import { IoAddSharp } from "react-icons/io5";
import ServerButtonsShimmer from "./loading/ServersLoading";
import { FaMessage } from "react-icons/fa6";
import ProfileAvatar from "../common/ProfileAvatar";
import { IoMdSettings } from "react-icons/io";
import NotificationIcon from "../common/NotificationIcon";
import { useSelector } from "react-redux";

const SideNav = ({handleContextMenu, handleServerClick, setActiveBorder, activeBorder, isLoading, servers, toggleModals}) => {
  const notifications = useSelector((state) => state.notifications)

    return (
        <div className=" h-screen py-4 px-[15px]">

        <div className="relative h-[40px] mb-4">
              <FaMessage
                onClick={() => setActiveBorder(-1)}
                className={`cursor-pointer w-10 text-green-500 rounded-md  h-10 `}
              />
              {activeBorder === -1 && (
                <p className="cursor-pointer w-[6px] h-[80%] bg-green-500 absolute left-[-15px] rounded-r-[100px]  top-[2px]"></p>
              )}

              {activeBorder === -1 && (
                <p className="cursor-pointer w-full h-[2px] bg-[#94a3b8] absolute left-0 rounded-r-[100px]  bottom-[-7px]"></p>
              )}              
        </div>
          
        <div className="overflow-y-auto overflow-x-hidden my-2 h-[80%] flex flex-col gap-4 items-center ">
          {
            isLoading ? (
                <ServerButtonsShimmer />
            ) : (
                servers?.map(({name, id: server_id}, index) => (
                  <button onContextMenu={(e) => handleContextMenu(e, server_id, name)}  className="relative h-[40px]" server_id={server_id} key={index} onClick={() => {handleServerClick(server_id, index)}}>
                    <ProfileAvatar fullName={name} />
                    <NotificationIcon notificationCount={notifications?.[server_id]?.count}/>
                    {activeBorder === index && (
                      <p className=" w-[6px] h-[80%] bg-green-500 absolute left-[-15px] rounded-r-[100px]  top-[2px]"></p>
                    )}
                    {activeBorder === index && (
                      <p className=" w-full h-[2px] bg-[#94a3b8] absolute left-0 rounded-r-[100px]  bottom-[-7px]"></p>
                    )}
                  </button>
                ))
            )
          }
        </div>
        <div className="h-[13%] overflow-y-hidden flex flex-col items-end justify-end">
          <IoMdSettings className=" mb-4 text-white cursor-pointer w-10 h-10 z-10 rounded-lg bg-blue-400" onClick={() => toggleModals('masterLinkView', true)}/>
          <IoAddSharp className=" text-white cursor-pointer w-10 h-10 z-10 rounded-lg bg-green-400" onClick={() => toggleModals('showAddServerModal',true)}/>
        </div>
     
      </div>
    )
}

export default SideNav;