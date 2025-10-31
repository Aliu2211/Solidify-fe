import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import useAuthStore from "../stores/authStore";
import LoadingSpinner from "./common/LoadingSpinner";

import darkLogo from "../assets/logo-dark.svg";
import whiteLogo from "../assets/logo-white.svg";

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
      // Navigate to home page on successful login
      navigate("/home");
    }
  };

  return (
    <div className="login-page">
      <UserCredentialsSection
        identifier={identifier}
        setIdentifier={setIdentifier}
        password={password}
        setPassword={setPassword}
        showPassword={showPassword}
        setShowPassword={setShowPassword}
        onSubmit={handleSubmit}
        isLoading={isLoading}
        error={error}
      />
      <AppMottoSection>SME Carbon Management Towards Net Zero</AppMottoSection>
    </div>
  );
}

// Left section of Page
export function UserCredentialsSection({
  identifier,
  setIdentifier,
  password,
  setPassword,
  showPassword,
  setShowPassword,
  onSubmit,
  isLoading,
  error,
  className,
}) {
  return (
    <div className={`credentials ${className}`}>
      <span className="logo-login">
        <img src={darkLogo} alt="dark-logo" />
      </span>

      <div className="auth-header">
        <h2>Welcome Back</h2>
        <p>Sign in to continue to your account</p>
      </div>

      <form className="form-user-credentials" onSubmit={onSubmit}>
        {error && (
          <div className="auth-error-message">
            <span className="material-symbols-outlined">error</span>
            {error}
          </div>
        )}

        <div className="form-field">
          <label>User ID or Email</label>
          <div className="input-wrapper">
            <span className="material-symbols-outlined input-icon">person</span>
            <input
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="Enter your User ID or Email"
              required
              disabled={isLoading}
            />
          </div>
        </div>

        <div className="form-field">
          <label>Password</label>
          <div className="input-wrapper">
            <span className="material-symbols-outlined input-icon">lock</span>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              disabled={isLoading}
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
              disabled={isLoading}
              tabIndex="-1"
            >
              <span className="material-symbols-outlined">
                {showPassword ? "visibility_off" : "visibility"}
              </span>
            </button>
          </div>
        </div>

        <div className="form-footer">
          <Link to="/forgot-password" className="forgot-password-link">
            Forgot Password?
          </Link>
        </div>

        <button type="submit" className="submit-btn" disabled={isLoading}>
          {isLoading ? <LoadingSpinner size="small" /> : "Sign In"}
        </button>
      </form>

      <div className="contact">
        Contact us at <a href="mailto:jehielbh@gmail.com">jehielbh@gmail.com</a>{" "}
        to get enrolled unto our system
      </div>
    </div>
  );
}

// Right section of page
export function AppMottoSection({ children, className }) {
  return (
    <div className={`brief-intro motto ${className}`}>
      <span className="logo-login">
        <img src={whiteLogo} alt="white-logo" />
      </span>

      <div className="text1">{children}</div>

      <div className="text2">Maintaining a carbon absent environment</div>
    </div>
  );
}
