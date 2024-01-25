import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  getUserInfoFromClientAdmin,
  getUserInfoFromLogin,
} from "../services/loginServices";
import {
  PRODUCT_LOGIN_URL,
  USER_KEY_IN_SESSION_STORAGE,
  getSavedLoggedInUser,
} from "../utils/utils";
import { useNavigate } from "react-router-dom";
import { store } from "../redux/store";
import { setUserProperty } from "../redux/features/auth/user-slice";

export default function useDowellLogin() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [publicChat, setPublicChat] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  let [sessionIdValue, setSessionIdValue] = useState('');

  useEffect(() => {

    if (searchParams.has('type') || searchParams.has('public_link_id') || searchParams.has('org_id')) {
      setPublicChat(true);
      setLoggedIn(false);
      return;
    }

    const session_id = searchParams.get("session_id");
    setSessionIdValue(session_id);
    const id = searchParams.get("id");
    const localUserDetails = getSavedLoggedInUser();

    if (localUserDetails) {
      // YOU CAN SAVE THE CURRENT USER TO A STATE TO USE IN THE APP
      console.log("current user: ", localUserDetails);
      setLoggedIn(true);
      return;
    }

    if (session_id) {
      if (id) {
        getUserInfoFromClientAdmin(session_id)
          .then((res) => {
            sessionStorage.setItem(
              USER_KEY_IN_SESSION_STORAGE,
              JSON.stringify(res.data)
            );
            setLoggedIn(true);
          })
          .catch((err) => {
            console.log(err);
          });

        return;
      }

      getUserInfoFromLogin(session_id)
        .then((res) => {
          sessionStorage.setItem(
            USER_KEY_IN_SESSION_STORAGE,
            JSON.stringify(res.data)
          );
          setLoggedIn(true);
        })
        .catch((err) => {
          console.log(err);
        });

      return;
    }

    // redirecting to login
    sessionStorage.clear();
    window.location.replace(PRODUCT_LOGIN_URL);
  }, []);

  store.dispatch(setUserProperty({
    propertyName: 'session_id',
    value: sessionIdValue
  }))

  return [loggedIn, publicChat];
}
