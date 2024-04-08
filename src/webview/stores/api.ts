import { createSlice } from "@reduxjs/toolkit";
import API from "../../utils/api";

export const apiSlice = createSlice({
  name: "api",
  initialState: {
    proxy: undefined,
    backendUrl: 'https://godbolt.org/api/',
  },
  reducers: {
    setProxy: (state, action) => {
      state.proxy = action.payload;
    },
    setBackendUrl: (state, action) => {
      state.backendUrl = action.payload;
    },
  },
});

export const { setProxy, setBackendUrl, } = apiSlice.actions;

export default apiSlice.reducer;
