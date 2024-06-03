import anilistUsers from "@/app/api/anilistUsers"
import axios from "axios"
import { Dispatch, SetStateAction } from "react"

export async function checkUserIsLoggedWithAnilist({ setUserDataHook }: { setUserDataHook: Dispatch<SetStateAction<UserAnilist | undefined>> }) {

    if (typeof window !== 'undefined') {

        const anilistUserData = localStorage.getItem("anilist-user")

        if (anilistUserData) {

            setUserDataHook(JSON.parse(anilistUserData))

            return

        }

        const anilistAccessInfo = window.location.hash

        const accessToken = anilistAccessInfo.slice(anilistAccessInfo.search(/\baccess_token=\b/), anilistAccessInfo.search(/\b&token_type\b/)).slice(13)
        const tokenType = anilistAccessInfo.slice(anilistAccessInfo.search(/\btoken_type=\b/), anilistAccessInfo.search(/\b&expires_in\b/)).slice(11)
        const expiresIn = anilistAccessInfo.slice(anilistAccessInfo.search(/\bexpires_in=\b/)).slice(11)

        if (anilistAccessInfo) {
            axios.post(`${window.location.origin}/api/anilist`, {
                accessToken: accessToken,
                tokenType: tokenType,
                expiresIn: expiresIn
            })
        }

        const userData = await anilistUsers.getCurrUserData({ accessToken: accessToken })

        setUserDataHook(userData as UserAnilist)

    }

}