import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; 
import { PersistPartial } from "redux-persist/es/persistReducer";
import userSlice, { UserState } from "./userSlice";

const persistConfig = {
  key: "user",
  storage,
};

const persistedUserReducer = persistReducer(persistConfig, userSlice);

export type rootState = {
  user : UserState & PersistPartial;
}

const store = configureStore({
  reducer: {
    user: persistedUserReducer, 
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);
export default store;