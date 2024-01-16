import ChatPage from "./pages/ChatPage";
import "./App.css";
import useDowellLogin from "./hooks/useDowellLogin";
import React, { useEffect, useState } from "react";
import { getAuthReq } from "./services/core-providers-di";
import { BrowserRouter , Route, useParams, Routes, useLocation} from 'react-router-dom';
import LoginPage from "./pages/LoginPage";

export default function App() {
  const loggedIn = useDowellLogin();
  const [fetchFinished, setFetchFinished] = useState(false);

  useEffect(() => {
    const getReq = async () => {
      if(loggedIn){
        console.log('loggedIn',loggedIn)
        const {product, api_key, org_id} = await getAuthReq();
        console.log("api_key", api_key)
        setFetchFinished(true);
     }
    }
    getReq();
  }, [loggedIn])


  return (
    <>
      {
        loggedIn && fetchFinished && <ChatPage />
      }
    </>
  );
}
