import { configureStore } from "@reduxjs/toolkit";
import UserInfoReducer from "@/app/lib/redux/features/manageUserData";
import ShowLoginModalReducer from "@/app/lib/redux/features/loginModal";

export const makeStore = () => {
  return configureStore({
    reducer: {
      UserInfo: UserInfoReducer,
      ShowLoginModal: ShowLoginModalReducer,
    },
  });
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
