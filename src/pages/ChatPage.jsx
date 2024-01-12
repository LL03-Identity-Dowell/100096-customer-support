import { useEffect, useState } from "react";
import ChatSection from "../component/chat/ChatSection";
import SideBar from "../component/chat/SideBar";
import { socketInstance } from "../services/core-providers-di";
import { useDispatch } from "react-redux";
import { socketSlice } from "../redux/features/chat/socket-slice";
import PopupModal from "../component/common/PopupModal";
import AddServerForm from "../component/chat/AddServerForm";
import { watchServers,getUserServers } from "../services/serverRepository";
import { useSelector } from "react-redux";
import CreateChannelForm from "../component/chat/CreateChannelForm";
import { watchChannels } from "../services/channelRepository";

const ChatPage = () => {
    const [isOpen, setIsOpen] = useState(true);
    const isConnected  = useSelector((state) => state.socket.isConnected)
    const dispatch = useDispatch();
    const [showAddServerModal, setAddServerModal] = useState(false);
    const [channelModal, setChannelModal] = useState(false)
    const handleSideBarToggle = () => {
      setIsOpen(!isOpen);
    };
  
    useEffect(() => {
      socketInstance.on('connect', () => {
        dispatch(socketSlice.actions.setConnected({
          isConnected: true,
        }))
      })
  
      socketInstance.on('disconnect', () => {
        dispatch(socketSlice.actions.setConnected({
          isConnected: false,
        }))
      })
    }, [])

    useEffect(() => {
      if(isConnected) {
        watchServers();
        watchChannels();
        getUserServers();
      }
    }, [isConnected])

    const toggleModal = () => {
      setAddServerModal(!showAddServerModal)
    }
    const toggleChannelModal = () => {
      setChannelModal(!channelModal)
    }
  
    return (
      <div className="h-screen flex bg-gray-300">
        <SideBar
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          handleSideBarToggle={handleSideBarToggle}
          setAddServerModal={setAddServerModal}
          setChannelModal={setChannelModal}
        />
        <ChatSection
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          handleSideBarToggle={handleSideBarToggle}
        />

        {
          showAddServerModal && (
            <PopupModal toggleModal={toggleModal}>
              <AddServerForm setAddServerModal={setAddServerModal} />
            </PopupModal>
          )
        }

        {
          channelModal && (
            <PopupModal toggleModal={toggleChannelModal}>
              <CreateChannelForm setShowModal={setChannelModal}/>
            </PopupModal>
          )
        }
      </div>
    )
}

export default ChatPage;