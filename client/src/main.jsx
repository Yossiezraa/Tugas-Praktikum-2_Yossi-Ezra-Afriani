import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import "./index.css";

import LoginPage from "./pages/Login.jsx";
import RegisterPage from "./pages/Register.jsx";
import Week1Page from "./pages/week1.jsx";
import HomePage from "./pages/home.jsx";
import BahayaPage from "./pages/Bahaya.jsx";
import Dashboard from "./pages/Dashboard.jsx";


const router = createBrowserRouter([
  {
    path: "/",
    element: <LoginPage />, 
  },
  {
    path: "/app",
    element: <App />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "week-1",
        element: <Week1Page />,
      },
    ],
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
  {
    path: "/bahaya",
    element: <BahayaPage />,
  },
  {
    path: "/homepage",
    element: <Dashboard />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
