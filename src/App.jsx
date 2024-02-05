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
import { useDispatch } from "react-redux";
import { setUserProperty } from "./redux/features/auth/user-slice";


export default function App() {
  const [loggedIn, publicChat] = useDowellLogin();
  const [fetchFinished, setFetchFinished] = useState(false);
  const dispatch = useDispatch()
  useEffect(() => {
    const getReq = async () => {
      if(loggedIn){
       const { product, api_key, org_id } = await getAuthReq();
       dispatch(setUserProperty({
        propertyName: 'isLoggedIn',
        value: true
       }))
       
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
          autoClose={4000}
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

