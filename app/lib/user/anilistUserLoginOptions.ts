import anilistUsers from "@/app/api/anilistUsers"
import axios from "axios"
import { addUserInfo } from "@/app/lib/redux/features/manageUserData"
import { makeStore } from "../redux/store"

export const userCustomStore = makeStore()

export async function handleAnilistUserLoginWithRedux() {

    const anilistUrlAccessInfo = window.location.hash

    const accessToken = anilistUrlAccessInfo.slice(anilistUrlAccessInfo.search(/\baccess_token=\b/), anilistUrlAccessInfo.search(/\b&token_type\b/)).slice(13)
    const tokenType = anilistUrlAccessInfo.slice(anilistUrlAccessInfo.search(/\btoken_type=\b/), anilistUrlAccessInfo.search(/\b&expires_in\b/)).slice(11)
    const expiresIn = anilistUrlAccessInfo.slice(anilistUrlAccessInfo.search(/\bexpires_in=\b/)).slice(11)

    if (anilistUrlAccessInfo) {
        axios.post(`${window.location.origin}/api/anilist`, {
            accessToken: accessToken,
            tokenType: tokenType,
            expiresIn: expiresIn
        })
    }

    const userData = await anilistUsers.getCurrUserData({ accessToken: accessToken })

    if (userData) {
        localStorage.setItem("anilist-user", JSON.stringify(userData))

        userCustomStore.dispatch(addUserInfo(userData))
    }

}
