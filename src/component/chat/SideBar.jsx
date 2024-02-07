import { FaMessage, FaStaylinked } from "react-icons/fa6";
import { IoIosSearch } from "react-icons/io";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ProfileAvatar from "../common/ProfileAvatar";
import ServerButtonsShimmer from "./loading/ServersLoading";
import { getServerChannels } from "../../services/channelRepository";
import ChannelsLoading from "./loading/ChannelsLoading";
import { IoAddSharp } from "react-icons/io5";
import CustomContextMenu from "./CustomContextMenu";
import { deleteServer } from "../../services/serverRepository";
import { getServerCategory } from "../../services/catagoryRepository";
import { IoChevronUpCircle } from "react-icons/io5";
import { IoChevronDownCircle } from "react-icons/io5";
import SideNav from "./SideNav";
import { joinPublicRoom } from "../../services/chatRepository";
import { setCategoryId } from "../../redux/features/chat/category-slice";
import NotificationIcon from "../common/NotificationIcon";
import { FaEdit } from "react-icons/fa";
import { MdEdit } from "react-icons/md";

const SideBar = ({ isOpen, setIsOpen, toggleModals, rightClickedServer, setRightClickedServer, setEditRoomNameId }) => {
  const notifications = useSelector((state) => state.notifications)
  const currentRoomId = useSelector((state) => state.chats.room_id)
  const {servers, isLoading, isError, error} = useSelector((state) => state.servers)
  const [serverName, setServeName] = useState('');
  const dispatch = useDispatch()
  const server_id = useSelector((state) => state.categories.server_id);
  const categoryServer = useSelector((state) => {
      const serverId = state.categories.server_id;
      return state.categories[serverId];
  })
  const [activeBorder, setActiveBorder] = useState(-1);
  const [contextMenuPosition, setContextMenuPosition] = useState(null);
  const [openCategories, setOpenCategories] = useState({});

  useEffect(() => {
    const server = servers?.filter((server) => server.id == server_id)
    if (server){
      setServeName(server[0]?.name)
    }
  }, [server_id])

  useEffect(() => {
    const initialOpenState = {};
    categoryServer?.categories?.forEach(({ _id: category_id }) => {
      initialOpenState[category_id] = true;
    });
    setOpenCategories(initialOpenState);
  }, [categoryServer?.categories]);


  const handleServerClick = (serverId, index) => {
    setActiveBorder(index)
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

  const handleMasterLink = (id) => {
    toggleModals('createMasterLink', true); 
    dispatch(setCategoryId({
      category_id: id
    }))
  }

  const handleToggleCategory = (category_id) => {
    setOpenCategories((prevOpenCategories) => ({
      ...prevOpenCategories,
      [category_id]: !prevOpenCategories[category_id],
    }));
  };
  
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
            {
              server_id && (
               <IoAddSharp  className="w-5 h-5 cursor-pointer" onClick={() => toggleModals('categoryModal', true)}/>
              )
            }
          </div>

          <div className="max-w-md mx-auto px-2 flex items-center bg-gray-200 rounded-sm">
            <input
              type="text"
              className="font-semibold placeholder-gray-400 bg-transparent focus:outline-none p-1"
              placeholder="Find a chat"
            />

            <IoIosSearch className="text-gray-400 pr-1" />
          </div>
          {
            categoryServer?.isLoading ? (
              <ChannelsLoading />
            ) : categoryServer?.isError ? (
              <p>{categoryServer?.error}</p>
            ) : (
              categoryServer?.categories?.map(({_id: category_id, name, rooms}, index) => (
                <div key={index} className="mb-2">
                  <div
                    id={category_id}
                    className="relative w-full flex gap-3 items-center justify-between border-2 border-black/10 p-2"
                  >
                    <img
                      src="avatar.jpg"
                      className="w-10 h-10 rounded-full bg-yellow-500"
                      alt={`User ${index}`}
                    />
                    <p className="text-left text-sm font-semibold">{name} </p>
                    <button
                     onClick={() => handleToggleCategory(category_id)}
                    >
                      {
                        openCategories[category_id] ? (
                          <IoChevronUpCircle className="text-black font-bold text-xl"/>
                          ) : (
                          <IoChevronDownCircle className="text-black font-bold text-xl"/>
                          )
                      }
                    </button>
                    <FaStaylinked onClick={() => handleMasterLink(category_id)} className="w-6 cursor-pointer"/>
                    <NotificationIcon notificationCount={notifications?.[server_id]?.[category_id]?.count}/>
                  </div>

                  {
                    openCategories[category_id] && (
                        <div className={`pl-2 flex flex-col items-center space-y-2 transition-all ${openCategories[category_id] ? 'opacity-100 max-h-96' : 'opacity-0 max-h-0'}`} >
                        {
                          rooms?.map(({_id: id, display_name}, index) => (
                            <button key={index} className={`w-full relative text-lg p-2 shadow-lg flex items-center justify-between ${id == currentRoomId ? 'bg-red-400' : 'bg-slate-300'}`} onClick={() => {handleJoinRoom(id)}}>
                              <span>{display_name || id}</span>
                              <MdEdit className="w-4 h-4 ml-1" onClick={() => {toggleModals('setDisplayNameModal', true); setEditRoomNameId(id)}}/>
                              <NotificationIcon notificationCount={notifications?.[server_id]?.[category_id]?.[id]}/>
                            </button>
                          ))
                        }
                      </div>
                    )
                  }
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
