import { configureStore } from '@reduxjs/toolkit'
import UserInfoReducer from "@/app/lib/redux/features/manageUserData"

export const makeStore = () => {
    return configureStore({
        reducer: {
            UserInfo: UserInfoReducer
        }
    })
}

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']