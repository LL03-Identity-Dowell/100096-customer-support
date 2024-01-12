export const USER_KEY_IN_SESSION_STORAGE = "cust-user";
export const PRODUCT_LOGIN_URL =
  "https://100014.pythonanywhere.com/?redirect_url=" +
  window.location.origin +
  "/100096-customer-support/%23";
export const LOGIN_URL = "https://100014.pythonanywhere.com/";
export const CLIENT_ADMIN_URL = "https://100093.pythonanywhere.com/";

export const getSavedLoggedInUser = () => {
  let userDetails;

  try {
    userDetails = JSON.parse(
      sessionStorage.getItem(USER_KEY_IN_SESSION_STORAGE)
    );
  } catch (error) {
    console.log("no saved user");
  }

  return userDetails;
};
