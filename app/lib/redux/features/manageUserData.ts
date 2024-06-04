"use client"
import anilistUsers from "@/app/api/anilistUsers"
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axios from "axios"

const initialState: { value: UserAnilist | null } = {

    value: typeof window !== 'undefined' ? JSON.parse(localStorage.getItem("anilist-user") as string) || null : null

}

export async function removeCookiesAndRefreshPage() {

    const removeUserCookie = await axios.delete(`${process.env.NEXT_PUBLIC_WEBSITE_ORIGIN_URL}/api/anilist`)
    const removeAdultCookie = await axios.delete(`${process.env.NEXT_PUBLIC_WEBSITE_ORIGIN_URL}/api/adult-content`)
    const removeLanguageCookie = await axios.delete(`${process.env.NEXT_PUBLIC_WEBSITE_ORIGIN_URL}/api/media-title-language`)

    if (removeUserCookie && removeAdultCookie && removeLanguageCookie) {

        window.location.href = `${process.env.NEXT_PUBLIC_WEBSITE_ORIGIN_URL}/`

    }

}

export const userInfo = createSlice({
    name: "UserInfo",
    initialState,
    reducers: {
        addUserInfo: (state, { payload }) => {

            state.value = payload

        },
        removeUserInfo: (state) => {

            localStorage.removeItem("anilist-user")

            state.value = null

            removeCookiesAndRefreshPage()

        },
    }
})

export const { addUserInfo, removeUserInfo } = userInfo.actions

export default userInfo.reducer