import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuthStore from "../stores/authStore";
import LoadingSpinner from "./common/LoadingSpinner";

import darkLogo from "../assets/logo-dark.svg";

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
    <div className="modern-login-container">
      {/* Left Section - Illustration/Branding */}
      <div className="login-illustration-section">
        <div className="illustration-content">
          <div className="illustration-pattern"></div>
          <div className="illustration-text">
            <h1>Secure Your Account</h1>
            <p>Password Recovery</p>
            <div className="illustration-subtitle">
              Password recovery made simple and secure
            </div>
          </div>
          <div className="floating-shapes">
            <div className="shape shape-1"></div>
            <div className="shape shape-2"></div>
            <div className="shape shape-3"></div>
          </div>
        </div>
      </div>

      {/* Right Section - Form */}
      <div className="login-form-section">
        <div className="form-container">
          <div className="login-logo">
            <img src={darkLogo} alt="Solidify Logo" />
          </div>

          {!isSubmitted ? (
            <>
              <div className="login-header">
                <h2>Forgot Password?</h2>
                <p className="subtitle-text">
                  No worries! Enter your email address and we'll send you a link to reset your
                  password.
                </p>
              </div>

              <form className="login-form" onSubmit={handleSubmit}>
                {error && (
                  <div className="error-banner">
                    <span className="material-symbols-outlined">error</span>
                    <span>{error}</span>
                  </div>
                )}

                <div className="form-group">
                  <label htmlFor="email">
                    Email Address <span className="required">*</span>
                  </label>
                  <div className="input-with-icon">
                    <span className="material-symbols-outlined icon">email</span>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email address"
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <button type="submit" className="btn-login" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <LoadingSpinner size="small" />
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <span>Send Reset Link</span>
                      <span className="material-symbols-outlined">send</span>
                    </>
                  )}
                </button>
              </form>

              <div className="login-footer">
                <p className="access-text">Remember your password?</p>
                <Link to="/login" className="link-secondary">
                  <span className="material-symbols-outlined">arrow_back</span>
                  Back to Login
                </Link>
              </div>
            </>
          ) : (
            <>
              <div className="success-message-container">
                <div className="success-icon">
                  <span className="material-symbols-outlined">mark_email_read</span>
                </div>
                <div className="login-header">
                  <h2>Check Your Email</h2>
                  <p className="subtitle-text">
                    We've sent a password reset link to <strong>{email}</strong>. Please check
                    your inbox and follow the instructions to reset your password.
                  </p>
                </div>

                <div className="success-actions">
                  <button onClick={handleBackToLogin} className="btn-login">
                    <span>Back to Login</span>
                    <span className="material-symbols-outlined">arrow_forward</span>
                  </button>
                  <button onClick={() => setIsSubmitted(false)} className="btn-secondary">
                    Didn't receive email? Try again
                  </button>
                </div>

                <div className="success-note">
                  <p>
                    <span className="material-symbols-outlined">info</span>
                    <strong>Note:</strong> If you don't see the email in a few minutes, check your
                    spam folder.
                  </p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
