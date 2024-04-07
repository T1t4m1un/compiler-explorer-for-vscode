import { createSlice } from "@reduxjs/toolkit";

export const asmSlice = createSlice({
  name: "asm",
  initialState: {
    selectedLineNo: -1,
    vscodeLineNo: -1,
  },
  reducers: {
    setSelectedLineNo: (state, action) => {
      state.selectedLineNo = action.payload;
    },
    setVscodeLineNo: (state, action) => {
      state.vscodeLineNo = action.payload;
    },
  },
});

export const { setSelectedLineNo, setVscodeLineNo } = asmSlice.actions;

export default asmSlice.reducer;
