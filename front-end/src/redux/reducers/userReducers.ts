import { CHANGE_SHOW_ADULT_CONTENT_FAIL, CHANGE_SHOW_ADULT_CONTENT_REQUEST, CHANGE_SHOW_ADULT_CONTENT_SUCCESS, DELETE_USER_MEDIA_FAIL, DELETE_USER_MEDIA_REQUEST, DELETE_USER_MEDIA_SUCCESS, UPDATE_USER_AVATAR_IMAGE_FAIL, UPDATE_USER_AVATAR_IMAGE_REQUEST, UPDATE_USER_AVATAR_IMAGE_SUCCESS, USER_ADD_EPISODE_BOOKMARK_FAIL, USER_ADD_EPISODE_BOOKMARK_REQUEST, USER_ADD_EPISODE_BOOKMARK_SUCCESS, USER_ALREADY_WATCHED_ADD_FAIL, USER_ALREADY_WATCHED_ADD_REQUEST, USER_ALREADY_WATCHED_ADD_SUCCESS, USER_ALREADY_WATCHED_REMOVE_FAIL, USER_ALREADY_WATCHED_REMOVE_REQUEST, USER_ALREADY_WATCHED_REMOVE_SUCCESS, USER_EPISODE_ALREADY_WATCHED_ADD_FAIL, USER_EPISODE_ALREADY_WATCHED_ADD_REQUEST, USER_EPISODE_ALREADY_WATCHED_ADD_SUCCESS, USER_EPISODE_ALREADY_WATCHED_REMOVE_FAIL, USER_EPISODE_ALREADY_WATCHED_REMOVE_REQUEST, USER_EPISODE_ALREADY_WATCHED_REMOVE_SUCCESS, USER_LOGIN_FAIL, USER_LOGIN_REQUEST, USER_LOGIN_SUCCESS, USER_LOGOUT_FAIL, USER_LOGOUT_REQUEST, USER_LOGOUT_SUCCESS, USER_MEDIA_ADD_FAIL, USER_MEDIA_ADD_REQUEST, USER_MEDIA_ADD_SUCCESS, USER_MEDIA_REMOVE_FAIL, USER_MEDIA_REMOVE_REQUEST, USER_MEDIA_REMOVE_SUCCESS, USER_PROFILE_UPDATE_FAIL, USER_PROFILE_UPDATE_REQUEST, USER_PROFILE_UPDATE_SUCCESS, USER_REGISTER_FAIL, USER_REGISTER_REQUEST, USER_REGISTER_SUCCESS, USER_REMOVE_EPISODE_BOOKMARK_FAIL, USER_REMOVE_EPISODE_BOOKMARK_REQUEST, USER_REMOVE_EPISODE_BOOKMARK_SUCCESS } from "../constants/userConstants";


export const userRegisterReducer = (state = {}, action: any) => {

    switch (action.type) {

        case USER_REGISTER_REQUEST:
            return { loading: true }
        case USER_REGISTER_SUCCESS:
            return { loading: false, userInfo: action.payload }
        case USER_REGISTER_FAIL:
            return { loading: false, error: action.payload }
        default:
            return state;

    }

}

export const userLoginReducer = (state = {}, action: any) => {

    switch (action.type) {

        case USER_LOGIN_REQUEST:
            return { loading: true }
        case USER_LOGIN_SUCCESS:
            return { loading: false, userInfo: action.payload }
        case USER_LOGIN_FAIL:
            return { loading: false, error: action.payload }
        default:
            return state;

    }

}

export const userLogoutReducer = (state = {}, action: any) => {

    switch (action.type) {

        case USER_LOGOUT_REQUEST:
            return { loading: true }
        case USER_LOGOUT_SUCCESS:
            return { loading: false }
        case USER_LOGOUT_FAIL:
            return { loading: false, error: action.payload }
        default:
            return state
    }

}

export const addMediaReducer = (state = {}, action: any) => {

    switch (action.type) {

        case USER_MEDIA_ADD_REQUEST:
            return { loading: true }
        case USER_MEDIA_ADD_SUCCESS:
            return { loading: false, userInfo: action.payload }
        case USER_MEDIA_ADD_FAIL:
            return { loading: false, error: action.payload }
        default:
            return state
    }

}

export const removeMediaReducer = (state = {}, action: any) => {

    switch (action.type) {

        case USER_MEDIA_REMOVE_REQUEST:
            return { loading: true }
        case USER_MEDIA_REMOVE_SUCCESS:
            return { loading: false, userInfo: action.payload }
        case USER_MEDIA_REMOVE_FAIL:
            return { loading: false, error: action.payload }
        default:
            return state
    }

}

export const addToAlreadyWatchedReducer = (state = {}, action: any) => {

    switch (action.type) {

        case USER_ALREADY_WATCHED_ADD_REQUEST:
            return { loading: true }
        case USER_ALREADY_WATCHED_ADD_SUCCESS:
            return { loading: false, alreadyWatched: action.payload }
        case USER_ALREADY_WATCHED_ADD_FAIL:
            return { loading: false, error: action.payload }
        default:
            return state;

    }

}

export const removeFromAlreadyWatchedReducer = (state = {}, action: any) => {

    switch (action.type) {

        case USER_ALREADY_WATCHED_REMOVE_REQUEST:
            return { loading: true }
        case USER_ALREADY_WATCHED_REMOVE_SUCCESS:
            return { loading: false, alreadyWatched: action.payload }
        case USER_ALREADY_WATCHED_REMOVE_FAIL:
            return { loading: false, error: action.payload }
        default:
            return state;

    }

}

export const addEpisodeToAlreadyWatchedReducer = (state = {}, action: any) => {

    switch (action.type) {

        case USER_EPISODE_ALREADY_WATCHED_ADD_REQUEST:
            return { loading: true }
        case USER_EPISODE_ALREADY_WATCHED_ADD_SUCCESS:
            return { loading: false, episodeAlreadyWatched: action.payload }
        case USER_EPISODE_ALREADY_WATCHED_ADD_FAIL:
            return { loading: false, error: action.payload }
        default:
            return state;

    }

}

export const removeEpisodeFromAlreadyWatchedReducer = (state = {}, action: any) => {

    switch (action.type) {

        case USER_EPISODE_ALREADY_WATCHED_REMOVE_REQUEST:
            return { loading: true }
        case USER_EPISODE_ALREADY_WATCHED_REMOVE_SUCCESS:
            return { loading: false, episodeAlreadyWatched: action.payload }
        case USER_EPISODE_ALREADY_WATCHED_REMOVE_FAIL:
            return { loading: false, error: action.payload }
        default:
            return state;

    }

}

export const addEpisodeToBookmarksReducer = (state = {}, action: any) => {

    switch (action.type) {

        case USER_ADD_EPISODE_BOOKMARK_REQUEST:
            return { loading: true }
        case USER_ADD_EPISODE_BOOKMARK_SUCCESS:
            return { loading: false, addToBookmarks: action.payload }
        case USER_ADD_EPISODE_BOOKMARK_FAIL:
            return { loading: false, error: action.payload }
        default:
            return state;

    }

}

export const removeEpisodeFromBookmarksReducer = (state = {}, action: any) => {

    switch (action.type) {

        case USER_REMOVE_EPISODE_BOOKMARK_REQUEST:
            return { loading: true }
        case USER_REMOVE_EPISODE_BOOKMARK_SUCCESS:
            return { loading: false, addToBookmarks: action.payload }
        case USER_REMOVE_EPISODE_BOOKMARK_FAIL:
            return { loading: false, error: action.payload }
        default:
            return state;

    }

}

export const updateUserInfoReducer = (state = {}, action: any) => {

    switch (action.type) {

        case USER_PROFILE_UPDATE_REQUEST:
            return { loading: true }
        case USER_PROFILE_UPDATE_SUCCESS:
            return { loading: false, error: false }
        case USER_PROFILE_UPDATE_FAIL:
            return { loading: false, error: action.payload }
        default:
            return state;

    }

}

export const updateAvatarImgReducer = (state = {}, action: any) => {

    switch (action.type) {

        case UPDATE_USER_AVATAR_IMAGE_REQUEST:
            return { loading: true }
        case UPDATE_USER_AVATAR_IMAGE_SUCCESS:
            return { loading: false, error: false }
        case UPDATE_USER_AVATAR_IMAGE_FAIL:
            return { loading: false, error: action.payload }
        default:
            return state;

    }

}

export const removeMediaFromUserReducer = (state = {}, action: any) => {

    switch (action.type) {

        case DELETE_USER_MEDIA_REQUEST:
            return { loading: true }
        case DELETE_USER_MEDIA_SUCCESS:
            return { loading: false, error: false }
        case DELETE_USER_MEDIA_FAIL:
            return { loading: false, error: action.payload }
        default:
            return state;

    }

}

export const changeAdultContentOptionReducer = (state = {}, action: any) => {

    switch (action.type) {

        case CHANGE_SHOW_ADULT_CONTENT_REQUEST:
            return { loading: true }
        case CHANGE_SHOW_ADULT_CONTENT_SUCCESS:
            return { loading: false, success: true }
        case CHANGE_SHOW_ADULT_CONTENT_FAIL:
            return { loading: false, error: action.payload }
        default:
            return state
    }

}