import { createSlice } from "@reduxjs/toolkit";
import API from "../../utils/api";

export const apiSlice = createSlice({
  name: "api",
  initialState: {
    api: undefined,
  },
  reducers: {
    setApi: (state, action) => {
      state.api = action.payload;
    },
  },
});

export const { setApi } = apiSlice.actions;

export default apiSlice.reducer;
