import { createSlice } from "@reduxjs/toolkit";

export const sourceSlice = createSlice({
  name: "source",
  initialState: {
    source: "",
  },
  reducers: {
    setSource: (state, action) => {
      state.source = action.payload;
    },
  },
});

export const { setSource } = sourceSlice.actions;

export default sourceSlice.reducer;
