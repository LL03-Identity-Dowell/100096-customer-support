import ChatPage from "./pages/ChatPage";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SettingPage from "./pages/SettingPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ChatPage />} />
        <Route path="/settings" element={<SettingPage />} />
      </Routes>
    </BrowserRouter>
  );
}
