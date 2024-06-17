import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import { AuthProvider } from './AuthContext';
import RootLayout, { RootIndex } from "./pages";
import About from "./pages/about";
import "./index.css";
import Chatboard from "./pages/Chatboard";
import LoginPage from "./pages/Login";
import SignUpPage from "./pages/Signup";
import ErrorPage from "./pages/error-page";
import MyProfilePage from "./pages/myprofile";
import LogoutPage from "./pages/logout";
import ChatGPTPage from "./pages/chatGPT";
// import dotenv from 'dotenv';

// dotenv.config();

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <RootIndex /> },
      {
        path: "/about",
        element: <About />,
      },
      {
        path: "/Chatboard",
        element: <Chatboard />,
      },
      {
        path: "/Login",
        element: <LoginPage />,
      },
      {
        path: "/signup",
        element: <SignUpPage />,
      },
      {
        path: "/myprofile",
        element: <MyProfilePage />,
      },
      {
        path: "/logout",
        element: <LogoutPage />,
      },
      {
        path: "/chatGPT",
        element: <ChatGPTPage />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>   
    <AuthProvider>
      <RouterProvider router={router}/>
    </AuthProvider> 
  </React.StrictMode>
);
