import { StrictMode, React } from "react";
import { createRoot } from "react-dom/client";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import "./index.css";
import "./styles/WelcomePage.css";
import "./styles/LoginPage.css";
import "./styles/ChangePassword.css";
import "./styles/Dashboard.css";
import "./styles/Header.css";
import "./styles/Profile.css";
import "./styles/Roadmap.css";
import "./styles/NewsSection.css";
import "./styles/Sustainability.css";
import "./styles/Contents.css";

import WelcomePage from "./App.jsx";
import LoginPage from "./components/LoginPage.jsx";
import ChangePasssword from "./components/ChangePassword.jsx";
import Dashboard from "./components/Dashboard.jsx";
import NewsSection from "./components/NewsSection.jsx";
import Sustainability from "./components/Sustainability.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/change-password" element={<ChangePasssword />} />

        <Route path="/home" element={<Dashboard />} />
        <Route path="/news" element={<NewsSection />} />
        <Route path="/sustainability-choices" element={<Sustainability />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
