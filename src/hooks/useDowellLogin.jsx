import { useEffect } from "react";
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

export default function useDowellLogin() {
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const session_id = searchParams.get("session_id");
    const id = searchParams.get("id");
    const localUserDetails = getSavedLoggedInUser();

    if (localUserDetails) {
      // YOU CAN SAVE THE CURRENT USER TO A STATE TO USE IN THE APP
      console.log("current user: ", localUserDetails);
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
}
