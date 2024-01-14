import { FaMessage } from "react-icons/fa6";
import { faL, faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import ProfileAvatar from "../common/ProfileAvatar";
import ServerButtonsShimmer from "./loading/ServersLoading";
import { getServerChannels } from "../../services/channelRepository";
import ChannelsLoading from "./loading/ChannelsLoading";
import { IoAddSharp } from "react-icons/io5";
import CustomContextMenu from "./CustomContextMenu";
import { deleteServer } from "../../services/serverRepository";
import { getServerCategory } from "../../services/catagoryRepository";
import { CiCircleChevDown } from "react-icons/ci";
import { CiCircleChevUp } from "react-icons/ci";
import SideNav from "./SideNav";
import { joinPublicRoom } from "../../services/chatRepository";

const SideBar = ({ isOpen, setIsOpen, toggleModals, rightClickedServer, setRightClickedServer }) => {
  const {servers, isLoading, isError, error} = useSelector((state) => state.servers)
  const [serverName, setServeName] = useState('');
  const server_id = useSelector((state) => state.categories.server_id);
  const categoryServer = useSelector((state) => {
      const serverId = state.categories.server_id;
      return state.categories[serverId];
  })
  const [activeBorder, setActiveBorder] = useState(-1);
  const [contextMenuPosition, setContextMenuPosition] = useState(null);

  useEffect(() => {
    const server = servers?.filter((server) => server.id == server_id)
    if (server){
      setServeName(server[0]?.name)
    }
  }, [server_id])

  const handleServerClick = (serverId, index) => {
    setActiveBorder(index)
    // getServerChannels(serverId);
    getServerCategory(serverId);
  }

  const handleServerDelete = () => {
    deleteServer(rightClickedServer.id);
    setContextMenuPosition(null);
    setRightClickedServer(null);
  };

  const handleServerEdit = () => {
    toggleModals('editServerModal', true);
  }

  const handleContextMenu = (e, id, name) => {
    e.preventDefault();
    setContextMenuPosition({ x: e.clientX, y: e.clientY });
    setRightClickedServer({
      id,
      name
    });
  };

  const handleJoinRoom = (room_id) => {
    joinPublicRoom(room_id);
  }

  
  return (
    <div className="flex">

      <SideNav 
        activeBorder={activeBorder} 
        handleContextMenu={handleContextMenu}
        handleServerClick={handleServerClick}
        isLoading={isLoading}
        servers={servers}
        setActiveBorder={setActiveBorder}
        toggleModals={toggleModals}
        />

      {isOpen && (
        <div className={`flex flex-col gap-4 pt-7 bg-white rounded-lg px-4 overflow-x-hidden overflow-y-auto`}>
          <div className="flex items-center justify-between">
            <h1 className="font-bold capitalize">{serverName}</h1>
             <IoAddSharp  className="w-5 h-5 cursor-pointer" onClick={() => toggleModals('categoryModal', true)}/>
          </div>

          <div className="max-w-md mx-auto px-2 flex items-center bg-gray-200 rounded-sm">
            <input
              type="text"
              className="font-semibold placeholder-gray-400 bg-transparent focus:outline-none p-1"
              placeholder="Find a chat"
            />

            <FontAwesomeIcon icon={faSearch} className="text-gray-400 pr-1" />
          </div>
          {
            categoryServer?.isLoading ? (
              <ChannelsLoading />
            ) : categoryServer?.isError ? (
              <p>{categoryServer?.error}</p>
            ) : (
              categoryServer?.categories?.map(({id, name, rooms}, index) => (
                <div key={index} className="mb-2">
                  <button
                    id={id}
                    className="w-full flex gap-3 items-center justify-between border-2 border-black/10 p-2"
                    onClick={() => {}}
                  >
                    <img
                      src="avatar.jpg"
                      className="w-10 h-10 rounded-full bg-yellow-500"
                      alt={`User ${index}`}
                    />
                    <p className="text-left text-sm font-semibold">{name} </p>
                    <CiCircleChevDown className="text-black font-bold w-10"/>
                  </button>

                  <div className="pl-2 flex flex-col items-center space-y-2" >
                      {
                        rooms?.map((id, index) => (
                          <button key={index} className="text-lg p-2 shadow-lg bg-slate-300" onClick={() => {handleJoinRoom(id)}}>
                            <span>{id}</span>
                          </button>
                        ))
                      }
                  </div>
                </div>
              ))
            )

          }
        </div>
      )}

      {
        contextMenuPosition && (
          <CustomContextMenu x={contextMenuPosition?.x} y={contextMenuPosition?.y} setContextMenuPosition={setContextMenuPosition} onDelete={handleServerDelete} onEdit={handleServerEdit} />
        )
      }
    </div>
  );
};

export default SideBar;
