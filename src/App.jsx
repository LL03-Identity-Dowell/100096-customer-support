import ChatPage from "./pages/ChatPage";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SettingPage from "./pages/SettingPage";
import DynamicChat from "./component/chat/dyamic-chat";

export default function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ChatPage />} />
        <Route path="/settings" element={<SettingPage />} />
        <Route path="/public_chat/:org_id" element={<DynamicChat />} />
      </Routes>
    </BrowserRouter>
  );
}
