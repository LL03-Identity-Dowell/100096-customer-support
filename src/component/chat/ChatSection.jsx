import { useState, useRef, useEffect } from "react";
import { MdVideoCall } from "react-icons/md";
import { IoCall, IoMenuSharp } from "react-icons/io5";
import ChatMessage from "./ChatMessage";
import dummyImage from "../../assets/dummy-image-green.jpg";
import { FaEllipsisVertical } from "react-icons/fa6";
import { IoMdSend } from "react-icons/io";
import { MdOutlineMenuOpen, MdOutlineAttachFile } from "react-icons/md";
import { useSelector } from "react-redux";
import CircularLoader from "../common/CircularLoader";
import { sendMessage } from "../../services/chatRepository";
import NewMessageLoader from "../common/NewMessageLoader";
import { FaStaylinked } from "react-icons/fa";


const ChatSection = ({ isOpen, setIsOpen, handleSideBarToggle }) => {
  const room_id = useSelector((state) => state.chats.room_id)
  const {user_id} = useSelector((state) => state.user)
  const messages = useSelector((state) => {
    const roomId = state.chats.room_id;
    return state.chats[roomId]
  })

  const currRoomName = useSelector((state) => state.categories.currRoomName);
  const scrollContainerRef = useRef(null);
  const [chatInput, setChatInput] = useState("");

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
        user_id: user_id,
        reply_to: 'None',
        created_at: Date.now()
      }
      sendMessage(messageData);
      setChatInput('');
    }
  }

  return (
    <div className={`ml-3 flex flex-col max-h-screen w-full ${isOpen && 'hidden md:flex'}`}>
      <div className="flex justify-between items-center p-4 bg-[#F1F3F4] border-b-2 border-gray-300 rounded-t-3xl">
        <button className="cursor-pointer" onClick={handleSideBarToggle}>
          {isOpen ? (
            <MdOutlineMenuOpen className="w-6 md:w-10 h-10 " />
          ) : (
            <IoMenuSharp className="w-6 md:w-10 h-10  " />
          )}
        </button>

        <div className="inline-flex items-start">
          <img
            src="avatar.jpg"
            alt="Rounded Image"
            className="w-10 md:w-16 rounded-full"
          />
          <div className="font-bold ml-3 mt-4 hidden md:block uppercase">
            {currRoomName || 'Support Team'}
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
          ) : messages.messages?.length == 0 || !messages?.messages ? (
            <p className="text-3xl font-light text-center h-full flex items-center justify-center">
              Start Chatting!
            </p>
          ) : (
            <div className="flex flex-col space-y-2 justify-end min-h-full">
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
};

export default ChatSection;
