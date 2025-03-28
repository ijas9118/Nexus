import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import breadcrumbReducer from "./slices/breadcrumbSlice";
import squadReducer from "./slices/squadSlice";
import userSquadsReducer from "./slices/userSquadsSlice";
import chatReducer from "./slices/chatSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    breadcrumb: breadcrumbReducer,
    squads: squadReducer,
    userSquads: userSquadsReducer,
    chat: chatReducer,
  },
});

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
