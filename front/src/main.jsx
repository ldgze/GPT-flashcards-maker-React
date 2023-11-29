import React, { useState, useCallback, createContext } from "react";
import ReactDOM from "react-dom/client";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import "./index.css";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Dashboard from "./pages/Dashboard.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Dashboard />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
]);

export const ErrorContext = createContext(null);

function RootComponent() {
  const [errors, setErrors] = useState([]);

  const addError = useCallback((newError) => {
    setErrors((prevErrors) => [...prevErrors, newError]);
  }, []); // Empty dependency array for useCallback

  const removeError = useCallback((index) => {
    setErrors((prevErrors) => prevErrors.filter((_, i) => i !== index));
  }, []);

  const clearErrors = useCallback(() => {
    setErrors([]); // Clear all errors
  }, []);

  return (
    <React.StrictMode>
      <ErrorContext.Provider
        value={{ addError, removeError, clearErrors, errors }}
      >
        <RouterProvider router={router} />
      </ErrorContext.Provider>
    </React.StrictMode>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<RootComponent />);
