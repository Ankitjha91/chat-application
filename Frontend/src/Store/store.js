import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./Slice/user/user.slice.js";
import messageReducer from "./Slice/message/message.slice.js";
import socketReducer from "./Slice/socket/socket.slice.js";


export const store = configureStore({
  reducer: {
    userReducer, // 🔥 this name must match your useSelector
    messageReducer,
    socketReducer,
  },

  middleware: (getDefaultMiddlware) =>
    getDefaultMiddlware({
      serializableCheck: {
        ignoredPaths: ["socketReducer.socket"],
      },
    }),


});
