import ChatPage from "./pages/ChatPage";
import "./App.css";
import useDowellLogin from "./hooks/useDowellLogin";
import { useEffect } from "react";
import { getAuthReq } from "./services/core-providers-di";

export default function App() {
  const loggedIn = useDowellLogin();

  useEffect(() => {
    const getReq = async () => {
      if(loggedIn){
        await getAuthReq();
     }
    }
    getReq();
  }, [loggedIn])

  return (
    <>
      {
        loggedIn && (
          <ChatPage />
        )
      }
    </>
  );
}
