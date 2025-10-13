import { StrictMode, React } from "react";
import { createRoot } from "react-dom/client";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import "./index.css";
import "./styles/WelcomePage.css";
import "./styles/LoginPage.css";
import "./styles/ChangePassword.css";
import "./styles/Dashboard.css";

import WelcomePage from "./App.jsx";
import LoginPage from "./components/LoginPage.jsx";
import ChangePasssword from "./components/ChangePassword.jsx";
import Dashboard from "./components/Dashboard.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/change-password" element={<ChangePasssword />} />

        <Route path="/home" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
