import { Provider } from "react-redux";
import { store } from "./store";

/* eslint-disable react/prop-types */

export function ReduxProvider({ children }) {
  return <Provider store={store}>{children}</Provider>;
}
