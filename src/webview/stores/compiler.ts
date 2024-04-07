import { createSlice } from "@reduxjs/toolkit";

export const compilerSlice = createSlice({
  name: "compiler",
  initialState: {
    currentLanguage: '',
    selectedCompilerId: '',
    compilers: [],
  },
  reducers: {
    setLanguage: (state, action) => {
      state.currentLanguage = action.payload;
    },
    setCompilerId: (state, action) => {
      state.selectedCompilerId = action.payload;
    },
    setCompilers: (state, action) => {
      state.compilers = action.payload;
    }
  },
});

export const { setLanguage, setCompilerId, setCompilers } = compilerSlice.actions;

export default compilerSlice.reducer;
