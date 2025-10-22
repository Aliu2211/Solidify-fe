import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../stores/authStore";
import LoadingSpinner from "./common/LoadingSpinner";

import darkLogo from "../assets/logo-dark.svg";
import whiteLogo from "../assets/logo-white.svg";

export default function LoginPage() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { login, isLoading } = useAuthStore();

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
        onSubmit={handleSubmit}
        isLoading={isLoading}
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
  onSubmit,
  isLoading,
  className,
}) {
  return (
    <div className={`credentials ${className}`}>
      <span className="logo-login">
        <img src={darkLogo} alt="dark-logo" />
      </span>

      <form className="form-user-credentials" onSubmit={onSubmit}>
        <span>
          <label>User ID or Email</label>
          <input
            type="text"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            placeholder="Enter your User ID or Email"
            required
            disabled={isLoading}
          />
        </span>

        <span>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
            disabled={isLoading}
          />
        </span>

        <button type="submit" disabled={isLoading}>
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
