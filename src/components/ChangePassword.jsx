import { UserCredentialsSection } from "./LoginPage";
import { AppMottoSection } from "./LoginPage";

export default function ChangePasssword() {
  return (
    <div className="new-password-page">
      <AppMottoSection className="no-bg">
        A solution to help Tech based SME’s reach Net Zero Carbon Emission
      </AppMottoSection>

      <UserCredentialsSection
        firstLabel="New Password"
        firstInputType="password"
        secondLabel="Confirm Password"
        buttonLabel="Proceed"
        nextPage="/home"
      />
    </div>
  );
}
