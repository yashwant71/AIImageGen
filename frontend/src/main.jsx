import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { ReduxProvider } from "./state/providers.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <ReduxProvider>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </ReduxProvider>
);
