"use client";
import { createSlice } from "@reduxjs/toolkit";

const initialState: { value: boolean } = {
  value: false,
};

export const showLoginModal = createSlice({
  name: "ShowLoginModal",
  initialState,
  reducers: {
    toggleShowLoginModalValue: (state) => {
      state.value = !state.value;
    },
  },
});

const { toggleShowLoginModalValue } = showLoginModal.actions;

export { toggleShowLoginModalValue };

export default showLoginModal.reducer;
