import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import useAuthStore from "../stores/authStore";
import LoadingSpinner from "./common/LoadingSpinner";

import darkLogo from "../assets/logo-dark.svg";

export default function ChangePasssword() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { changePassword, isLoading } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validate passwords match
    if (newPassword !== confirmPassword) {
      setError("New passwords do not match");
      return;
    }

    // Validate password length
    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    const result = await changePassword(currentPassword, newPassword);

    if (result.success) {
      // Navigate to home page on successful password change
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
            <h1>Secure Your Account</h1>
            <p>Change Password</p>
            <div className="illustration-subtitle">
              Keep your account secure by updating your password regularly
            </div>
          </div>
          <div className="floating-shapes">
            <div className="shape shape-1"></div>
            <div className="shape shape-2"></div>
            <div className="shape shape-3"></div>
          </div>
        </div>
      </div>

      {/* Right Section - Change Password Form */}
      <div className="login-form-section">
        <div className="form-container">
          <div className="login-logo">
            <img src={darkLogo} alt="Solidify Logo" />
          </div>

          <div className="login-header">
            <h2>Change Your Password</h2>
            <p className="subtitle-text">Enter your current password and choose a new one</p>
          </div>

          <form className="login-form" onSubmit={handleSubmit}>
            {error && (
              <div className="error-banner">
                <span className="material-symbols-outlined">error</span>
                <span>{error}</span>
              </div>
            )}

            <div className="form-group">
              <label htmlFor="current-password">
                Current Password <span className="required">*</span>
              </label>
              <div className="input-with-icon">
                <span className="material-symbols-outlined icon">lock</span>
                <input
                  id="current-password"
                  type={showCurrentPassword ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter your current password"
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  disabled={isLoading}
                  tabIndex="-1"
                  aria-label={showCurrentPassword ? "Hide password" : "Show password"}
                >
                  <span className="material-symbols-outlined">
                    {showCurrentPassword ? "visibility_off" : "visibility"}
                  </span>
                </button>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="new-password">
                New Password <span className="required">*</span>
              </label>
              <div className="input-with-icon">
                <span className="material-symbols-outlined icon">key</span>
                <input
                  id="new-password"
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password (min. 8 characters)"
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  disabled={isLoading}
                  tabIndex="-1"
                  aria-label={showNewPassword ? "Hide password" : "Show password"}
                >
                  <span className="material-symbols-outlined">
                    {showNewPassword ? "visibility_off" : "visibility"}
                  </span>
                </button>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="confirm-password">
                Confirm New Password <span className="required">*</span>
              </label>
              <div className="input-with-icon">
                <span className="material-symbols-outlined icon">check_circle</span>
                <input
                  id="confirm-password"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your new password"
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={isLoading}
                  tabIndex="-1"
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                >
                  <span className="material-symbols-outlined">
                    {showConfirmPassword ? "visibility_off" : "visibility"}
                  </span>
                </button>
              </div>
            </div>

            <div className="password-requirements">
              <p className="requirements-title">Password must contain:</p>
              <ul>
                <li className={newPassword.length >= 8 ? "valid" : ""}>
                  <span className="material-symbols-outlined">
                    {newPassword.length >= 8 ? "check_circle" : "radio_button_unchecked"}
                  </span>
                  At least 8 characters
                </li>
              </ul>
            </div>

            <button type="submit" className="btn-login" disabled={isLoading}>
              {isLoading ? (
                <>
                  <LoadingSpinner size="small" />
                  <span>Updating Password...</span>
                </>
              ) : (
                <>
                  <span>Change Password</span>
                  <span className="material-symbols-outlined">arrow_forward</span>
                </>
              )}
            </button>
          </form>

          <div className="login-footer">
            <p className="access-text">
              Remember your password?
            </p>
            <Link to="/home" className="link-secondary">
              <span className="material-symbols-outlined">arrow_back</span>
              Back to Dashboard
            </Link>
          </div>

          <div className="admin-help-section">
            <p className="help-text">
              <span className="material-symbols-outlined">support_agent</span>
              Need help? Contact us at{" "}
              <a href="mailto:jehielbh@gmail.com" className="link-primary">
                jehielbh@gmail.com
              </a>
            </p>
          </div>
        </div>
      </div>
    <div className="new-password-page">
      <AppMottoSection className="no-bg">
        A solution to help Tech based SME’s reach Net Zero Carbon Emission
      </AppMottoSection>

      <UserCredentialsSection
        firstLabel="New Password"
        firstInputType="password"
        secondLabel="Confirm Password"
        buttonLabel="Proceed"
        nextPage="/dashboard"
      />
    </div>
  );
}
