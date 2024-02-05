import { configureStore } from "@reduxjs/toolkit";
import channelsSlice from "./features/chat/channels-slice";
import serversSlice from "./features/chat/servers-slice";
import socketSlice from "./features/chat/socket-slice";
import categorySlice  from "./features/chat/category-slice";
import chatSlice from "./features/chat/chat-slice";
import userSlice from "./features/auth/user-slice";
import masterSlice from "./features/chat/master-slice";
import notificationSlice from "./features/chat/notification-slice";

export const store = configureStore({
  reducer: {
    channels: channelsSlice,
    servers: serversSlice,
    categories: categorySlice,
    socket: socketSlice,
    chats: chatSlice,
    user: userSlice,
    masterlink: masterSlice,
    notifications: notificationSlice
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({}).concat([]),
  devTools: true,
  //   devTools: import.meta.env.NODE_ENV !== "production",

});
