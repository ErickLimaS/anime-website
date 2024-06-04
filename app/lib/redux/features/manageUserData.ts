"use client"
import anilistUsers from "@/app/api/anilistUsers"
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axios from "axios"

const initialState: { value: UserAnilist | null } = {

    value: typeof window !== 'undefined' ? JSON.parse(localStorage.getItem("anilist-user") as string) || null : null

}

async function removeCookieAndRefreshPage() {

    const res = await axios.delete(`${window.location.origin}/api/anilist`)

    if (res) window.location.href = `${process.env.NEXT_PUBLIC_WEBSITE_ORIGIN_URL}/`

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

            removeCookieAndRefreshPage()

        },
    }
})

export const { addUserInfo, removeUserInfo } = userInfo.actions

export default userInfo.reducer