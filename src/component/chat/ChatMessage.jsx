import { IoIosCheckmark } from "react-icons/io";
import { USER_ID } from "../../services/core-providers-di";

const ChatMessage = ({ message }) => {
  const isSender = message?.author === USER_ID;

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);

    if (isNaN(date.getTime())) {
      return "";
    }
    return date.toLocaleString(); // Adjust the format based on your requirements
  };
    
  return (
    <div className={`${isSender ? "self-end" : "self-start"}`}>
      <div className={`${isSender ? 'bg-green-300 rounded-full rounded-tr ml-auto' : 'bg-blue-300 rounded-full rounded-tl self-start mr-auto'} flex items-center w-fit text-sm sm:text-base text-black/50 shadow-lg py-2 px-3`}>
        <IoIosCheckmark className="text-2xl" />
        <p >{message?.message_data}</p>
      </div>
      <p className={`${isSender ? 'text-right' : 'text-left'} w-full text-xs text-gray-500 `}>{formatDate(message?.created_at)}</p>
    </div>
  );
};

export default ChatMessage;
