import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import "./index.css";
import "./styles/WelcomePage.css";
import "./styles/LoginPage.css";
import "./styles/ChangePassword.css";
import "./styles/Dashboard.css";
import "./styles/CarbonEntry.css";
import "./styles/Header.css";
import "./styles/Profile.css";
import "./styles/Roadmap.css";
import "./styles/News.css";
import "./styles/NewsSection.css";
import "./styles/NewsDetail.css";
import "./styles/Skeleton.css";
import "./styles/Sustainability.css";
import "./styles/Contents.css";
import "./styles/Chat.css";
import "./styles/FindSME.css";
import "./styles/Settings.css";
import "./styles/Library.css";
import "./styles/AdminDashboard.css";

import WelcomePage from "./App.jsx";
import LoginPage from "./components/LoginPage.jsx";
import AdminLoginPage from "./components/AdminLoginPage.jsx";
import ForgotPassword from "./components/ForgotPassword.jsx";
import ResetPassword from "./components/ResetPassword.jsx";
import ChangePasssword from "./components/ChangePassword.jsx";
import Dashboard from "./components/Dashboard.jsx";
import CarbonEntry from "./components/CarbonEntry.jsx";
import NewsSection from "./components/NewsSection.jsx";
import NewsDetail from "./components/NewsDetail.jsx";
import Sustainability from "./components/Sustainability.jsx";
import LibrarySection from "./components/LibrarySection.jsx";
import Chat from "./components/Chat.jsx";
import FindSME from "./components/FindSME.jsx";
import Settings from "./components/Settings.jsx";
import ProtectedRoute from "./components/common/ProtectedRoute.jsx";
import AdminGuard from "./components/common/AdminGuard.jsx";
import NotFound from "./components/NotFound.jsx";

// Admin Components
import AdminDashboard from "./components/admin/AdminDashboard.jsx";
import DashboardOverview from "./components/admin/DashboardOverview.jsx";
import CourseManager from "./components/admin/CourseManager.jsx";
import LibraryManager from "./components/admin/LibraryManager.jsx";
import NewsManager from "./components/admin/NewsManager.jsx";
import KnowledgeManager from "./components/admin/KnowledgeManager.jsx";
import OrganizationManager from "./components/admin/OrganizationManager.jsx";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 4000,
        style: {
          background: "#363636",
          color: "#fff",
        },
        success: {
          duration: 3000,
          iconTheme: {
            primary: "#10b981",
            secondary: "#fff",
          },
        },
        error: {
          duration: 4000,
          iconTheme: {
            primary: "#ef4444",
            secondary: "#fff",
          },
        },
      }}
    />
    <Routes>
      <Route path="/" element={<WelcomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/admin/login" element={<AdminLoginPage />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/change-password" element={<ChangePasssword />} />

      {/* Protected Routes */}
      <Route
        path="/home"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/carbon-entry"
        element={
          <ProtectedRoute>
            <CarbonEntry />
          </ProtectedRoute>
        }
      />
      <Route
        path="/news"
        element={
          <ProtectedRoute>
            <NewsSection />
          </ProtectedRoute>
        }
      />
      <Route
        path="/news/:slug"
        element={
          <ProtectedRoute>
            <NewsDetail />
          </ProtectedRoute>
        }
      />
      <Route
        path="/sustainability-choices"
        element={
          <ProtectedRoute>
            <Sustainability />
          </ProtectedRoute>
        }
      />

      <Route
        path="/library"
        element={
          <ProtectedRoute>
            <LibrarySection />
          </ProtectedRoute>
        }
      />

      <Route
        path="/chat"
        element={
          <ProtectedRoute>
            <Chat />
          </ProtectedRoute>
        }
      />
      <Route
        path="/find-SME"
        element={
          <ProtectedRoute>
            <FindSME />
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        }
      />

      {/* Admin Routes */}
      <Route
        path="/admin"
        element={
          <AdminGuard>
            <AdminDashboard />
          </AdminGuard>
        }
      >
        <Route index element={<DashboardOverview />} />
        <Route path="courses" element={<CourseManager />} />
        <Route path="library" element={<LibraryManager />} />
        <Route path="news" element={<NewsManager />} />
        <Route path="knowledge" element={<KnowledgeManager />} />
        <Route path="organizations" element={<OrganizationManager />} />
      </Route>

      {/* Catch-all route for 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  </BrowserRouter>
);
