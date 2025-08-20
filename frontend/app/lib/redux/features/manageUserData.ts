"use client";
import { createSlice } from "@reduxjs/toolkit";
import { removeCookies } from "../../user/anilistUserLoginOptions";

const initialState: { value: UserAnilist | null } = {
  value:
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("anilist-user") as string) || null
      : null,
};

export const userInfo = createSlice({
  name: "UserInfo",
  initialState,
  reducers: {
    addUserInfo: (state, { payload }) => {
      state.value = payload;
    },
    removeUserInfo: (state) => {
      localStorage.removeItem("anilist-user");

      state.value = null;

      removeCookies();
    },
  },
});

const { addUserInfo } = userInfo.actions;
const { removeUserInfo } = userInfo.actions;

export { addUserInfo };
export { removeUserInfo };

export default userInfo.reducer;
