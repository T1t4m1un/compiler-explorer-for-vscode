import { createSlice } from "@reduxjs/toolkit";

export const compilationOptionsSlice = createSlice({
  name: "compilationOptions",
  initialState: {
    userArguments: '',
  },
  reducers: {
    setUserArguments: (state, action) => {
      state.userArguments = action.payload;
    }
  },
});

export const { setUserArguments } = compilationOptionsSlice.actions;

export default compilationOptionsSlice.reducer;
