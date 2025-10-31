import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuthStore from "../stores/authStore";
import LoadingSpinner from "./common/LoadingSpinner";

import darkLogo from "../assets/logo-dark.svg";
import whiteLogo from "../assets/logo-white.svg";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const navigate = useNavigate();
  const { forgotPassword, isLoading, error, clearError } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();

    const result = await forgotPassword(email);

    if (result.success) {
      setIsSubmitted(true);
    }
  };

  const handleBackToLogin = () => {
    navigate("/login");
  };

  return (
    <div className="login-page forgot-password-page">
      <div className="credentials">
        <span className="logo-login">
          <img src={darkLogo} alt="dark-logo" />
        </span>

        {!isSubmitted ? (
          <>
            <div className="auth-header">
              <h2>Forgot Password?</h2>
              <p>
                No worries! Enter your email address and we'll send you a link to reset your
                password.
              </p>
            </div>

            <form className="form-user-credentials" onSubmit={handleSubmit}>
              {error && (
                <div className="auth-error-message">
                  <span className="material-symbols-outlined">error</span>
                  {error}
                </div>
              )}

              <div className="form-field">
                <label>Email Address</label>
                <div className="input-wrapper">
                  <span className="material-symbols-outlined input-icon">email</span>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              <button type="submit" className="submit-btn" disabled={isLoading}>
                {isLoading ? <LoadingSpinner size="small" /> : "Send Reset Link"}
              </button>

              <div className="form-footer" style={{ justifyContent: "center", marginTop: "8px" }}>
                <Link to="/login" className="back-to-login-link">
                  <span className="material-symbols-outlined">arrow_back</span>
                  Back to Login
                </Link>
              </div>
            </form>
          </>
        ) : (
          <div className="success-message-container">
            <div className="success-icon">
              <span className="material-symbols-outlined">mark_email_read</span>
            </div>
            <div className="auth-header">
              <h2>Check Your Email</h2>
              <p>
                We've sent a password reset link to <strong>{email}</strong>. Please check your
                inbox and follow the instructions to reset your password.
              </p>
            </div>

            <div className="success-actions">
              <button onClick={handleBackToLogin} className="submit-btn">
                Back to Login
              </button>
              <button
                onClick={() => setIsSubmitted(false)}
                className="secondary-btn"
              >
                Didn't receive email? Try again
              </button>
            </div>

            <div className="success-note">
              <p>
                <strong>Note:</strong> If you don't see the email in a few minutes, check your spam
                folder.
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="brief-intro motto">
        <span className="logo-login">
          <img src={whiteLogo} alt="white-logo" />
        </span>
        <div className="text1">Secure Your Account</div>
        <div className="text2">Password recovery made simple and secure</div>
      </div>
    </div>
  );
}
