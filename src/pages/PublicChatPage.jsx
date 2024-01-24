import { useState, useRef, useEffect } from "react";
import { MdVideoCall } from "react-icons/md";
import { IoCall} from "react-icons/io5";
import ChatMessage from "../component/chat/ChatMessage";
import logo from "../assets/logo.jpg";
import { FaEllipsisVertical } from "react-icons/fa6";
import { IoMdSend } from "react-icons/io";
import { MdOutlineAttachFile } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import CircularLoader from "../component/common/CircularLoader";
import { createPublicRoom, sendMessage } from "../services/chatRepository";
import NewMessageLoader from "../component/common/NewMessageLoader";
import { useSearchParams } from "react-router-dom";
import { setUserProperty } from "../redux/features/auth/user-slice";
import { watchChats } from "../services/chatRepository";
import { cleanupSocket } from "../services/core-providers-di";

const PublicChatPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const type = searchParams.get('type');
    const publicLinkId = searchParams.get('public_link_id');
    const orgId = searchParams.get('org_id');
    const categoryId = searchParams.get('category_id');
    const product = searchParams.get('product');

    const room_id = useSelector((state) => state.chats.room_id);
    const dispatch = useDispatch();
    const messages = useSelector((state) => {
      const roomId = state.chats.room_id;
      return state.chats[roomId]
    })
    const scrollContainerRef = useRef(null);
    const [chatInput, setChatInput] = useState("");

    useEffect(() => {
      watchChats();

      return () => {
        cleanupSocket();
      };
    }, [])

    useEffect(() => {
      dispatch(setUserProperty({
        propertyName: 'user_id',
        value: publicLinkId
      }))

      createPublicRoom({
        public_link_id : publicLinkId,
        category_id: categoryId,
        workspace_id: orgId,
        product,
        created_at: Date.now()        
      })
      
    }, [type, publicLinkId, orgId, categoryId, product])
  
    useEffect(() => {
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTop =
          scrollContainerRef.current.scrollHeight;
      }
    }, [messages]);
  
    const handleSendMessage = () => {
      if(chatInput.trim() !== '') {
        const messageData = {
          room_id,
          message_data: chatInput,
          user_id: USER_ID,
          reply_to: 'None',
          created_at: Date.now()
        }
        sendMessage(messageData);
        setChatInput('');
      }
    }

    console.log("here here here", publicLinkId)
    

  
    return (
      <div className={`ml-3 flex flex-col h-screen w-full`}>
        <div className="flex justify-between items-center p-4 bg-[#F1F3F4] border-b-2 border-gray-300 rounded-t-3xl">
            <img src={logo} className="w-10 md:w-16 rounded-md" />
  
          <div className="inline-flex items-start">
            <img
              src="avatar.jpg"
              alt="Rounded Image"
              className="w-10 md:w-16 rounded-full"
            />
            <div className="font-bold ml-3 mt-4 hidden md:block uppercase">
              WORKFLOW AI
            </div>
          </div>
  
          <div className="flex items-center space-x-3 md:space-x-4 lg:space-x-6">
            {/* <FaStaylinked onClick={() => toggleModals('masterLinkView', true)} className="w-6 md:w-10 h-10 text-xl cursor-pointer"/> */}
            <MdVideoCall className="w-6 md:w-10 h-10 text-xl" />
            <IoCall className="w-4 md:w-8  h-8 text-xl" />
            <FaEllipsisVertical className="w-4 md:w-8 h-6 md:h-8 " />
          </div>
        </div>
     
        <section
          ref={scrollContainerRef}
          className="relative h-[80%] flex-grow overflow-y-auto bg-white px-2 "
        >
          {
            messages?.isLoading ? (
              <CircularLoader />
            ) : messages?.isError ? (
              <p>{messages?.error}</p>
            ) : !room_id ? (
              <p className="text-3xl font-light text-center h-full flex items-center justify-center">
                Please Select a room to chat in!
              </p>
            ) : (
              <div className="flex flex-col space-y-2 h-full justify-end mt-auto">
                {messages?.messages.map((message, index) => (
                  <ChatMessage key={index} message={message} />
                ))}
                {
                  messages?.isSendingMessage && (
                    <NewMessageLoader />
                  )
                }
              </div>  
            )
          }
  
        </section>
  
        <div className="relative flex items-center p-4 bg-white">
          <input
            type="text"
            placeholder="Type here ..."
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') { handleSendMessage() } }}
            className={`w-full rounded-lg border border-gray-300 px-4 py-2 ${room_id === null ? 'cursor-not-allowed' : ''}`}
            disabled={room_id === null}
          />
          <MdOutlineAttachFile className={`absolute text-gray-500 hover:text-gray-700 pt-1 right-32 h-10 w-6 cursor-pointer transform rotate-12 origin-center ${room_id === null ? 'cursor-not-allowed' : ''}`} />
          <button
            onClick={handleSendMessage}
            className={`ml-2 rounded-lg bg-blue-500 px-4 py-2 text-white inline-flex items-center ${room_id === null ? 'cursor-not-allowed' : ''}`}
            disabled={room_id === null}
          >
            <span>Send</span>
            <IoMdSend className="ml-2 text-white" />
          </button>
        </div>
  
      </div>
    );
}

export default PublicChatPage;