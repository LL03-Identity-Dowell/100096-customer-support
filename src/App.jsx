import ChatPage from "./pages/ChatPage";
import PublicChatPage from "./pages/PublicChatPage"; // Import the PublicChatPage component
import "./App.css";
import useDowellLogin from "./hooks/useDowellLogin";
import React, { useEffect, useState } from "react";
import { getAuthReq } from "./services/core-providers-di";
import { BrowserRouter, Route, Routes,} from 'react-router-dom';
import LoginPage from "./pages/LoginPage";
import CircularLoader from "./component/common/CircularLoader";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';


export default function App() {
  const [loggedIn, publicChat] = useDowellLogin();
  const [fetchFinished, setFetchFinished] = useState(false);

  useEffect(() => {
    const getReq = async () => {
      if(loggedIn){
       const { product, api_key, org_id } = await getAuthReq();
    }
      setFetchFinished(true);
    };

    getReq();
  }, [loggedIn]);

  return (
    <>
      <Routes>
        <Route path="/" element={loggedIn && fetchFinished ? <ChatPage /> : publicChat ? <PublicChatPage /> : <CircularLoader /> }/>
      </Routes>
      <ToastContainer 
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          transition: Bounce
          >
          </ToastContainer>
    </>
  );
}

