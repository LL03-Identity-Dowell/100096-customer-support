import { useEffect, useState } from "react";
import ChatSection from "../component/chat/ChatSection";
import SideBar from "../component/chat/SideBar";
import { cleanupSocket, socketInstance } from "../services/core-providers-di";
import { useDispatch } from "react-redux";
import { socketSlice } from "../redux/features/chat/socket-slice";
import PopupModal from "../component/common/PopupModal";
import AddServerForm from "../component/chat/forms/AddServerForm";
import { watchServers,getUserServers } from "../services/serverRepository";
import { useSelector } from "react-redux";
import CreateChannelForm from "../component/chat/forms/CreateChannelForm";
import { watchChannels } from "../services/channelRepository";
import EditServerForm from "../component/chat/forms/EditServerForm";
import { watchCategory } from "../services/catagoryRepository";
import CreateCategoryForm from "../component/chat/forms/CreateCategoryForm";
import { createPublicRoom, watchChats } from "../services/chatRepository";
import MasterLinkView from "../component/chat/forms/MasterLinkPopup";
import CreateMasterLink from "../component/chat/forms/CreateMasterLink";
import { watchMasterLink } from "../services/masterLinkRepository";

const ChatPage = () => {
    const [isOpen, setIsOpen] = useState(true);
    const isConnected  = useSelector((state) => state.socket.isConnected)
    const dispatch = useDispatch();
    const [modals, setModals] = useState({
      showAddServerModal: false,
      channelModal: false,
      editServerModal: false,
      categoryModal: false,
      masterLinkView: false,
      createMasterLink: false,
    });
    const [rightClickedServer, setRightClickedServer] = useState(null);
  
    const handleSideBarToggle = () => {
      setIsOpen(!isOpen);
    };
  
    // useEffect(() => {
    //   socketInstance.on('connect', () => {
    //     dispatch(socketSlice.actions.setConnected({
    //       isConnected: true,
    //     }))
    //   })
  
    //   socketInstance.on('disconnect', () => {
    //     dispatch(socketSlice.actions.setConnected({
    //       isConnected: false,
    //     }))
    //   })
    // }, [])

    useEffect(() => {
        watchServers();
        getUserServers();
        // createPublicRoom({
        //   category_id: "65a757c1c5b56cc2cab6ba3d",
        //   public_link_id: "ab62f07f",
        //   created_at: Date.now()
        // })
        watchChannels();
        watchCategory();
        watchChats();
        watchMasterLink();

      return () => {
        cleanupSocket();
      };
    }, [])

    const toggleModals = (modalName, value) => {
      if(value !== undefined){
        setModals((prevModals) => ({
          ...prevModals,
          [modalName]: value,
        }));
      }else{
        setModals((prevModals) => ({
          ...prevModals,
          [modalName]: !prevModals[modalName],
        }));
      }
    };
  
    
  
    return (
      <div className="h-screen flex bg-gray-300">
        <SideBar
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          handleSideBarToggle={handleSideBarToggle}
          toggleModals={toggleModals}
          setRightClickedServer={setRightClickedServer}
          rightClickedServer={rightClickedServer}
        />
        <ChatSection
          toggleModals={toggleModals}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          handleSideBarToggle={handleSideBarToggle}
        />

        {
          modals.showAddServerModal && (
            <PopupModal toggleModals={toggleModals} modalName='showAddServerModal'>
              <AddServerForm toggleModals={toggleModals} />
            </PopupModal>
          )
        }

        {
          modals.channelModal && (
            <PopupModal toggleModals={toggleModals} modalName='channelModal'>
              <CreateChannelForm toggleModals={toggleModals} />
            </PopupModal>
          )
        }

        {
          modals.editServerModal && (
          <PopupModal toggleModals={toggleModals} modalName='editServerModal'>
            <EditServerForm toggleModals={toggleModals} rightClickedServer={rightClickedServer}/>
          </PopupModal>
          )
        }

        {
          modals.categoryModal && (
            <PopupModal toggleModals={toggleModals} modalName='categoryModal'>
              <CreateCategoryForm toggleModals={toggleModals}/>
            </PopupModal>
          )
        }

        {
          modals.masterLinkView && (
            <PopupModal toggleModals={toggleModals} modalName='masterLinkView'>
              <MasterLinkView toggleModals={toggleModals}/>
            </PopupModal>
          )
        }
        {
          modals.createMasterLink && (
            <PopupModal toggleModals={toggleModals} modalName='createMasterLink'>
              <CreateMasterLink toggleModals={toggleModals}/>
            </PopupModal>
          )
        }
      </div>
    )
}

export default ChatPage;