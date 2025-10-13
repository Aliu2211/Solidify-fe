import { useNavigate } from "react-router-dom";

import darkLogo from "./assets/logo-dark2.svg";
import welcomePageLogo from "./assets/welcome-page.svg";
import LoginPage from "./components/LoginPage";

function App() {
  return (
    <div>
      <WelcomePage />
    </div>
  );
}

// welcome page
function WelcomePage() {
  return (
    <div className="welcome-page">
      <span className="logo">
        <img src={darkLogo} alt="welcome-page-logo" />
      </span>

      <div className="brief-intro">
        <span className="text1">
          An application to help Tech based SME’s achieve Net Zero Carbon
          Emission
        </span>

        <span>
          <img src={welcomePageLogo} alt="welcome-logo" />
        </span>

        <p className="text2">
          Providing the tools to help grow your tech based SME.
        </p>
      </div>

      {/* button navigates to Login page */}
      <Button className="button" nextPage="/login">
        Proceed
      </Button>
    </div>
  );
}

export function Button({ children, className, nextPage }) {
  const navigate = useNavigate();

  return (
    <button onClick={() => navigate(nextPage)} className={className}>
      {children}
    </button>
  );
}

export default App;
