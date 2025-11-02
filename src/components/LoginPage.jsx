import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import useAuthStore from "../stores/authStore";
import LoadingSpinner from "./common/LoadingSpinner";

import darkLogo from "../assets/logo-dark.svg";

export default function LoginPage() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login, isLoading, error } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = await login(identifier, password);

    if (result.success) {
      navigate("/home");
    }
  };

  return (
    <div className="modern-login-container">
      {/* Left Section - Illustration/Branding */}
      <div className="login-illustration-section">
        <div className="illustration-content">
          <div className="illustration-pattern"></div>
          <div className="illustration-text">
            <h1>SME Carbon Management</h1>
            <p>Towards Net Zero</p>
            <div className="illustration-subtitle">
              Empowering businesses to track, reduce, and offset their carbon footprint
            </div>
          </div>
          <div className="floating-shapes">
            <div className="shape shape-1"></div>
            <div className="shape shape-2"></div>
            <div className="shape shape-3"></div>
          </div>
        </div>
      </div>

      {/* Right Section - Login Form */}
      <div className="login-form-section">
        <div className="form-container">
          <div className="login-logo">
            <img src={darkLogo} alt="Solidify Logo" />
          </div>

          <div className="login-header">
            <h2>Enter Your Details To Login</h2>
          </div>

          <form className="login-form" onSubmit={handleSubmit}>
            {error && (
              <div className="error-banner">
                <span className="material-symbols-outlined">error</span>
                <span>{error}</span>
              </div>
            )}

            <div className="form-group">
              <label htmlFor="identifier">
                Email Address or Phone Number <span className="required">*</span>
              </label>
              <div className="input-with-icon">
                <span className="material-symbols-outlined icon">person</span>
                <input
                  id="identifier"
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="Email or 10-digit Phone Number"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="password">
                Password <span className="required">*</span>
              </label>
              <div className="input-with-icon">
                <span className="material-symbols-outlined icon">lock</span>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                  tabIndex="-1"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  <span className="material-symbols-outlined">
                    {showPassword ? "visibility_off" : "visibility"}
                  </span>
                </button>
              </div>
            </div>

            <div className="form-footer-link">
              <Link to="/forgot-password" className="link-primary">
                Forgot Password?
              </Link>
            </div>

            <button type="submit" className="btn-login" disabled={isLoading}>
              {isLoading ? (
                <>
                  <LoadingSpinner size="small" />
                  <span>Logging In...</span>
                </>
              ) : (
                "Log In"
              )}
            </button>
          </form>

          <div className="login-footer">
            <p className="access-text">
              Don't have access anymore?
            </p>
            <Link to="/" className="link-secondary">
              Go To Portal Homepage
            </Link>
          </div>

          <div className="admin-access-link">
            <Link to="/admin/login" className="link-admin">
              <span className="material-symbols-outlined">admin_panel_settings</span>
              Admin Portal Access
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
