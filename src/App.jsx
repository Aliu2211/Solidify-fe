import { useState } from "react";
import { useNavigate } from "react-router-dom";

import darkLogo from "./assets/logo-dark2.svg";
import welcomePageLogo from "./assets/welcome-page.svg";
import LoginPage from "./LoginPage";

function App() {
  return (
    // // login page (will get back to it later)
    // <div>
    //   <UserCredentialsSection />
    //   <AppMottoSection />
    // </div>

    <div>
      <WelcomePage />
    </div>
  );
}

// welcome page
function WelcomePage() {
  const navigate = useNavigate();

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
      <button onClick={() => navigate("/login")} className="button">
        Proceed
      </button>
    </div>
  );
}

// login page (will get back to it later)

// function UserCredentialsSection() {
//   return (

//     <div>
//       <div className="logo">Logo</div>
//       <div className="user-credentials">User Credentials</div>
//       <div className="contact">Contact Jehiel</div>
//     </div>
//   );
// }

// function AppMottoSection() {}

export default App;
