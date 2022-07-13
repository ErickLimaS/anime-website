import { applyMiddleware, combineReducers, compose, createStore } from "redux";
import thunk from "redux-thunk";
import { addMediaReducer, addToAlreadyWatchedReducer, removeFromAlreadyWatchedReducer, removeMediaFromUserReducer, removeMediaReducer, updateAvatarImgReducer, updateUserInfoReducer, userLoginReducer, userLogoutReducer, userRegisterReducer } from "./reducers/userReducers";


const initialState = {
    userLogin: {
        userInfo: localStorage.getItem('userInfo') ?
            JSON.parse(localStorage.getItem('userInfo') || `{}`) : null
        // JSON.stringify(localStorage.getItem('userInfo')) : null
    }
}

const reducer = combineReducers({
    userRegister: userRegisterReducer,
    userLogin: userLoginReducer,
    userLogout: userLogoutReducer,
    addMediaToUserAccount: addMediaReducer,
    removeMediaFromUserAccount: removeMediaReducer,
    updateUserInfo: updateUserInfoReducer,
    updateAvatarImg: updateAvatarImgReducer,
    deleteUserMedia: removeMediaFromUserReducer,
    addToAlreadyWatched: addToAlreadyWatchedReducer,
    removeFromAlreadyWatched: removeFromAlreadyWatchedReducer
})

const composeEnhancer = typeof window === 'object' && (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ? typeof window === 'object' && (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ : compose;
// const composeEnhancer =  compose;

const store = createStore(
    reducer,
    initialState,
    composeEnhancer(applyMiddleware(thunk))
)

export default store;