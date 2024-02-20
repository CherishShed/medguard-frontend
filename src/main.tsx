import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import { ToastContainer } from "react-toastify";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
console.log(PUBLISHABLE_KEY);
if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
      <ToastContainer limit={2} />
    </BrowserRouter>
  </React.StrictMode>
);
