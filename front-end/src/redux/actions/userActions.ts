import Axios from "axios";
import { AnyAction, Dispatch } from "redux";
import { USER_LOGIN_FAIL, USER_LOGIN_REQUEST, USER_LOGIN_SUCCESS, USER_LOGOUT_FAIL, USER_LOGOUT_REQUEST, USER_LOGOUT_SUCCESS, USER_MEDIA_ADD_FAIL, USER_MEDIA_ADD_REQUEST, USER_MEDIA_ADD_SUCCESS, USER_MEDIA_REMOVE_FAIL, USER_MEDIA_REMOVE_REQUEST, USER_MEDIA_REMOVE_SUCCESS, USER_REGISTER_FAIL, USER_REGISTER_REQUEST, USER_REGISTER_SUCCESS } from "../constants/userConstants";

const MONGODB_USER_URL = "https://animes-website-db.herokuapp.com/users"
const CORS_ANYWHERE = 'https://cors-anywhere.herokuapp.com/'

export const registerUser = (name: String, email: String, password: String) => async (dispatch: Dispatch<AnyAction>) => {

    dispatch({ type: USER_REGISTER_REQUEST, action: { name, email, password } })

    try {

        const { data } = await Axios({
            url: `${CORS_ANYWHERE}${MONGODB_USER_URL}/register`,
            method: 'POST',
            headers: {
                'Content-Type': 'application/Json'
            },
            data: {
                "name": `${name}`,
                "email": `${email}`,
                "password": `${password}`,
            }
        })

        console.log(data)

        dispatch({ type: USER_REGISTER_SUCCESS, payload: data })
        dispatch({ type: USER_LOGIN_SUCCESS, payload: data })

        localStorage.setItem('userInfo', JSON.stringify(data))

    }
    catch (error: any) {

        if (error.response.status === 403) {
            console.log(`Go get the Cors ${CORS_ANYWHERE}`)
        }

        dispatch({
            type: USER_REGISTER_FAIL,
            payload: error.response && error.response.data.message ? error.response.data.message : error.message
        })

    }

}

export const loginUser = (email: String, password: String) => async (dispatch: Dispatch<AnyAction>) => {

    dispatch({ type: USER_LOGIN_REQUEST, payload: email, password })

    try {

        const { data } = await Axios({
            url: `${CORS_ANYWHERE}${MONGODB_USER_URL}/login`,
            method: 'POST',
            headers: {
                'Content-Type': 'application/JSON'
            },
            data: {
                'email': `${email}`,
                'password': `${password}`
            }
        })

        dispatch({ type: USER_LOGIN_SUCCESS, payload: data })

        localStorage.setItem('userInfo', JSON.stringify(data))

    }
    catch (error: any) {

        console.log(error.response.status)
        dispatch({
            type: USER_LOGIN_FAIL,
            payload: error.response && error.response.data.message ? error.response.status : error.response.status
            // payload: error.response && error.response.data.message ? error.response.data.message : error.message
        })


    }


}

export const logoutUser = (id: number) => async (dispatch: Dispatch<AnyAction>) => {

    dispatch({ type: USER_LOGOUT_REQUEST, action: id })

    try {

        localStorage.removeItem('userInfo')

        dispatch({ type: USER_LOGOUT_SUCCESS, action: id })

        document.location.reload()

    }
    catch (error: any) {

        dispatch({ type: USER_LOGOUT_FAIL, payload: error })

    }


}

export const addMediaToUserAccount = (id: String, media: any) => async (dispatch: Dispatch<AnyAction>) => {

    dispatch({ type: USER_MEDIA_ADD_REQUEST, action: media })

    try {

        const { data } = await Axios({
            url: `${CORS_ANYWHERE}${MONGODB_USER_URL}/add-media`,
            method: 'POST',
            headers: {
                'Content-Type': 'application/JSON'
            },
            data: {
                'id': `${id}`,
                'media': media
            }

        })

        console.log(data)

        localStorage.setItem('userInfo', JSON.stringify(data))

        dispatch({ type: USER_MEDIA_ADD_SUCCESS, action: data })

    }
    catch (error: any) {

        dispatch({ type: USER_MEDIA_ADD_FAIL, action: error })

    }

}

export const removeMediaFromUserAccount = (id: String, media: any) => async (dispatch: Dispatch<AnyAction>) => {

    dispatch({ type: USER_MEDIA_REMOVE_REQUEST, action: media })

    try {

        const { data } = await Axios({
            url: `${CORS_ANYWHERE}${MONGODB_USER_URL}/remove-media`,
            method: 'POST',
            headers: {
                'Content-Type': 'application/JSON'
            },
            data: {
                'id': `${id}`,
                'media': media
            }

        })

        localStorage.setItem('userInfo', JSON.stringify(data))

        dispatch({ type: USER_MEDIA_REMOVE_SUCCESS, action: data })

    }
    catch (error: any) {

        dispatch({ type: USER_MEDIA_REMOVE_FAIL, action: error })

    }

}