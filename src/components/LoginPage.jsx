import { useState } from "react";

import { Button } from "../App";

import darkLogo from "../assets/logo-dark.svg";
import whiteLogo from "../assets/logo-white.svg";

export default function LoginPage() {
  return (
    <div className="login-page">
      <UserCredentialsSection
        firstLabel="User ID"
        firstInputType="email"
        secondLabel="Password"
        buttonLabel="Sign In"
        nextPage="/change-password"
      />
      <AppMottoSection>SME Carbon Management Towards Net Zero</AppMottoSection>
    </div>
  );
}

// Left section of Page
export function UserCredentialsSection({
  firstLabel,
  firstInputType,
  secondLabel,
  secondInputType = "password",
  buttonLabel,
  nextPage,
  className,
}) {
  return (
    <div className={`credentials ${className}`}>
      <span className="logo-login">
        <img src={darkLogo} alt="dark-logo" />
      </span>

      <form className="form-user-credentials">
        <span>
          <label>{firstLabel}</label>
          <input type={firstInputType} required />
        </span>

        <span>
          <label>{secondLabel}</label>
          <input type={secondInputType} required />
        </span>

        {/* fix navigation later */}
        <Button nextPage={nextPage}>{buttonLabel}</Button>
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
