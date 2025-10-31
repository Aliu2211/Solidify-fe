import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import useAuthStore from "../stores/authStore";
import LoadingSpinner from "./common/LoadingSpinner";

import darkLogo from "../assets/logo-dark.svg";
import whiteLogo from "../assets/logo-white.svg";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({ score: 0, label: "" });
  const [validationErrors, setValidationErrors] = useState([]);

  const navigate = useNavigate();
  const { resetPassword, isLoading, error, clearError } = useAuthStore();

  // Redirect if no token
  useEffect(() => {
    if (!token) {
      navigate("/forgot-password");
    }
  }, [token, navigate]);

  // Validate password strength
  useEffect(() => {
    if (password.length === 0) {
      setPasswordStrength({ score: 0, label: "" });
      return;
    }

    const strength = calculatePasswordStrength(password);
    setPasswordStrength(strength);
  }, [password]);

  const calculatePasswordStrength = (pwd) => {
    let score = 0;
    const checks = {
      length: pwd.length >= 8,
      uppercase: /[A-Z]/.test(pwd),
      lowercase: /[a-z]/.test(pwd),
      number: /[0-9]/.test(pwd),
      special: /[^A-Za-z0-9]/.test(pwd),
    };

    score += checks.length ? 1 : 0;
    score += checks.uppercase ? 1 : 0;
    score += checks.lowercase ? 1 : 0;
    score += checks.number ? 1 : 0;
    score += checks.special ? 1 : 0;

    if (score <= 2) return { score, label: "Weak", color: "#ef4444" };
    if (score === 3) return { score, label: "Fair", color: "#f59e0b" };
    if (score === 4) return { score, label: "Good", color: "#10b981" };
    return { score, label: "Strong", color: "#22c55e" };
  };

  const validateForm = () => {
    const errors = [];

    if (password.length < 8) {
      errors.push("Password must be at least 8 characters long");
    }

    if (!/[A-Z]/.test(password)) {
      errors.push("Password must contain at least one uppercase letter");
    }

    if (!/[a-z]/.test(password)) {
      errors.push("Password must contain at least one lowercase letter");
    }

    if (!/[0-9]/.test(password)) {
      errors.push("Password must contain at least one number");
    }

    if (password !== confirmPassword) {
      errors.push("Passwords do not match");
    }

    setValidationErrors(errors);
    return errors.length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();

    if (!validateForm()) {
      return;
    }

    const result = await resetPassword(token, password);

    if (result.success) {
      // Navigate to login after 2 seconds
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    }
  };

  return (
    <div className="login-page reset-password-page">
      <div className="credentials">
        <span className="logo-login">
          <img src={darkLogo} alt="dark-logo" />
        </span>

        <div className="auth-header">
          <h2>Reset Password</h2>
          <p>Create a new strong password for your account</p>
        </div>

        <form className="form-user-credentials" onSubmit={handleSubmit}>
          {error && (
            <div className="auth-error-message">
              <span className="material-symbols-outlined">error</span>
              {error}
            </div>
          )}

          {validationErrors.length > 0 && (
            <div className="auth-error-message">
              <span className="material-symbols-outlined">error</span>
              <ul style={{ margin: 0, paddingLeft: "20px" }}>
                {validationErrors.map((err, idx) => (
                  <li key={idx}>{err}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="form-field">
            <label>New Password</label>
            <div className="input-wrapper">
              <span className="material-symbols-outlined input-icon">lock</span>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter new password"
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

            {/* Password Strength Indicator */}
            {password.length > 0 && (
              <div className="password-strength">
                <div className="strength-bars">
                  {[1, 2, 3, 4, 5].map((bar) => (
                    <div
                      key={bar}
                      className={`strength-bar ${
                        bar <= passwordStrength.score ? "active" : ""
                      }`}
                      style={{
                        backgroundColor:
                          bar <= passwordStrength.score ? passwordStrength.color : "#e5e7eb",
                      }}
                    />
                  ))}
                </div>
                <span
                  className="strength-label"
                  style={{ color: passwordStrength.color }}
                >
                  {passwordStrength.label}
                </span>
              </div>
            )}
          </div>

          <div className="form-field">
            <label>Confirm Password</label>
            <div className="input-wrapper">
              <span className="material-symbols-outlined input-icon">lock_check</span>
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                required
                disabled={isLoading}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                disabled={isLoading}
                tabIndex="-1"
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
              <li className={password.length >= 8 ? "valid" : ""}>
                <span className="material-symbols-outlined">
                  {password.length >= 8 ? "check_circle" : "cancel"}
                </span>
                At least 8 characters
              </li>
              <li className={/[A-Z]/.test(password) ? "valid" : ""}>
                <span className="material-symbols-outlined">
                  {/[A-Z]/.test(password) ? "check_circle" : "cancel"}
                </span>
                One uppercase letter
              </li>
              <li className={/[a-z]/.test(password) ? "valid" : ""}>
                <span className="material-symbols-outlined">
                  {/[a-z]/.test(password) ? "check_circle" : "cancel"}
                </span>
                One lowercase letter
              </li>
              <li className={/[0-9]/.test(password) ? "valid" : ""}>
                <span className="material-symbols-outlined">
                  {/[0-9]/.test(password) ? "check_circle" : "cancel"}
                </span>
                One number
              </li>
            </ul>
          </div>

          <button type="submit" className="submit-btn" disabled={isLoading}>
            {isLoading ? <LoadingSpinner size="small" /> : "Reset Password"}
          </button>

          <div className="form-footer" style={{ justifyContent: "center", marginTop: "8px" }}>
            <Link to="/login" className="back-to-login-link">
              <span className="material-symbols-outlined">arrow_back</span>
              Back to Login
            </Link>
          </div>
        </form>
      </div>

      <div className="brief-intro motto">
        <span className="logo-login">
          <img src={whiteLogo} alt="white-logo" />
        </span>
        <div className="text1">Almost There!</div>
        <div className="text2">Create a strong password to secure your account</div>
      </div>
    </div>
  );
}
