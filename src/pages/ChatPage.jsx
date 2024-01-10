import { useEffect, useState } from "react";
import SideBar from "../components/chat/Sidebar";
import ChatSection from "../components/chat/ChatSection";

export default function ChatPage() {
  const [isOpen, setIsOpen] = useState(true);
  const handleSideBarToggle = () => {
    setIsOpen(!isOpen);
  };


  return (
    <div className="h-screen flex bg-gray-300">
      <SideBar
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        handleSideBarToggle={handleSideBarToggle}
      />
      <ChatSection
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        handleSideBarToggle={handleSideBarToggle}
      />
    </div>
  );
}