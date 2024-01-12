import ChatPage from "./pages/ChatPage";
import "./App.css";
import useDowellLogin from "./hooks/useDowellLogin";

export default function App() {
  useDowellLogin();

  return <ChatPage />;
}
