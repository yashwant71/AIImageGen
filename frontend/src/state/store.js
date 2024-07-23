import { configureStore } from "@reduxjs/toolkit";
import formpayload from "./reducer/formpayload";

export const store = configureStore({
  reducer: {
    formpayload: formpayload,
  },
});

