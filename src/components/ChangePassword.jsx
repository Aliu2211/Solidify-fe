import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../stores/authStore";
import LoadingSpinner from "./common/LoadingSpinner";
import { AppMottoSection } from "./LoginPage";

import darkLogo from "../assets/logo-dark.svg";

export default function ChangePasssword() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
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
    <div className="new-password-page">
      <AppMottoSection className="no-bg">
        A solution to help Tech based SME's reach Net Zero Carbon Emission
      </AppMottoSection>

      <div className="credentials">
        <span className="logo-login">
          <img src={darkLogo} alt="dark-logo" />
        </span>

        <form className="form-user-credentials" onSubmit={handleSubmit}>
          <span>
            <label>Current Password</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Enter your current password"
              required
              disabled={isLoading}
            />
          </span>

          <span>
            <label>New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password (min. 8 characters)"
              required
              disabled={isLoading}
            />
          </span>

          <span>
            <label>Confirm New Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              required
              disabled={isLoading}
            />
          </span>

          {error && <p className="error-message">{error}</p>}

          <button type="submit" disabled={isLoading}>
            {isLoading ? <LoadingSpinner size="small" /> : "Change Password"}
          </button>
        </form>

        <div className="contact">
          Need help? Contact us at{" "}
          <a href="mailto:jehielbh@gmail.com">jehielbh@gmail.com</a>
        </div>
      </div>
    </div>
  );
}
