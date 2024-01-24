// import ChatPage from "./pages/ChatPage";
// import "./App.css";
// import useDowellLogin from "./hooks/useDowellLogin";
// import React, { useEffect, useState } from "react";
// import { getAuthReq } from "./services/core-providers-di";
// import { BrowserRouter , Route, useParams, Routes, useLocation} from 'react-router-dom';
// import LoginPage from "./pages/LoginPage";

// export default function App() {
//   const loggedIn = useDowellLogin();
//   const [fetchFinished, setFetchFinished] = useState(false);

//   useEffect(() => {
//     const getReq = async () => {
//       if(loggedIn){
//         const {product, api_key, org_id, USER_ID} = await getAuthReq();
//         console.log("api_key", api_key, 'userId', USER_ID)
//         setFetchFinished(true);
//      }
//     }
//     getReq();
//   }, [loggedIn])


//   return (
//     <>
//       {
//         loggedIn && fetchFinished && <ChatPage />
//       }
//     </>
//   );
// }

import ChatPage from "./pages/ChatPage";
import PublicChatPage from "./pages/PublicChatPage"; // Import the PublicChatPage component
import "./App.css";
import useDowellLogin from "./hooks/useDowellLogin";
import React, { useEffect, useState } from "react";
import { getAuthReq } from "./services/core-providers-di";
import { BrowserRouter, Route, Routes,} from 'react-router-dom';
import LoginPage from "./pages/LoginPage";
import CircularLoader from "./component/common/CircularLoader";

export default function App() {
  const [loggedIn, publicChat] = useDowellLogin();
  const [fetchFinished, setFetchFinished] = useState(false);

  useEffect(() => {
    const getReq = async () => {
      if(loggedIn){
       const { product, api_key, org_id, USER_ID } = await getAuthReq();
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
    </>
  );
}

