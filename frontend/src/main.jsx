import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import RootLayout, { RootIndex } from "./pages";
import About from "./pages/About";
import "./index.css";
import Finder from "./pages/Finder";
import Draw from "./pages/Draw";
import ErrorPage from "./pages/error-page";
import Addnew from "./pages/Addnew";
import AdminAdd from "./pages/AdminAdd";
import AdminDelete from "./pages/AdminDelete";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <RootIndex /> },
      {
        path: "/About",
        element: <About />,
      },
      {
        path: "/Finder",
        element: <Finder />,
      },
      {
        path: "/Draw",
        element: <Draw />,
      },
      {
        path: "/Addnew",
        element: <Addnew />,
      },
      {
        path: "/AdminAdd",
        element: <AdminAdd />,
      },
      {
        path: "/AdminDelete",
        element: <AdminDelete />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>   
    <RouterProvider router={router}/>
  </React.StrictMode>
);
