import { createSlice } from "@reduxjs/toolkit";
import API from "../../utils/api";

export const apiSlice = createSlice({
  name: "api",
  initialState: {
    api: undefined,
    backendUrl: 'https://godbolt.org/api/',
  },
  reducers: {
    setApi: (state, action) => {
      state.api = action.payload;
    },
    setBackendUrl: (state, action) => {
      state.backendUrl = action.payload;
    },
  },
});

export const { setApi, setBackendUrl, } = apiSlice.actions;

export default apiSlice.reducer;
