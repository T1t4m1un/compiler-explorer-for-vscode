import { configureStore } from "@reduxjs/toolkit";
import { compilerSlice } from "./compiler";
import { apiSlice } from "./api";
import { compilationOptionsSlice } from "./compilationOptions";
import { sourceSlice } from "./source";

export const store = configureStore({
  reducer: {
    compiler: compilerSlice.reducer,
    api: apiSlice.reducer,
    compilationOptions: compilationOptionsSlice.reducer,
    source: sourceSlice.reducer,
  },
});
