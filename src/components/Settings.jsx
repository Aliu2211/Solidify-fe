import { useState } from "react";
import { Header } from "./Header";
import { Profile } from "./Profile";
import { Body } from "./Dashboard";
import useAuthStore from "../stores/authStore";
import toast from "react-hot-toast";

export default function Settings() {
  const { user, changePassword } = useAuthStore();
  const [activeSection, setActiveSection] = useState("profile");

  // Account settings state
  const [accountData, setAccountData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (accountData.newPassword !== accountData.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    const result = await changePassword(accountData.currentPassword, accountData.newPassword);
    if (result.success) {
      setAccountData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    }
  };

  return (
    <div className="settings-page">
      <Header defaultTab="settings">
        <Profile />
      </Header>
      <Body className="settings">
        <div className="settings-container">
          {/* Settings Sidebar */}
          <aside className="settings-sidebar">
            <h2 className="settings-title">Settings</h2>
            <nav className="settings-nav">
              <button
                className={`settings-nav-item ${activeSection === "profile" ? "active" : ""}`}
                onClick={() => setActiveSection("profile")}
              >
                <span className="material-symbols-outlined">person</span>
                Profile
              </button>
              <button
                className={`settings-nav-item ${activeSection === "account" ? "active" : ""}`}
                onClick={() => setActiveSection("account")}
              >
                <span className="material-symbols-outlined">security</span>
                Account & Security
              </button>
            </nav>
          </aside>

          {/* Settings Content */}
          <main className="settings-content">
            {activeSection === "profile" && (
              <ProfileSettings user={user} />
            )}
            {activeSection === "account" && (
              <AccountSettings
                accountData={accountData}
                setAccountData={setAccountData}
                onSave={handlePasswordChange}
              />
            )}
          </main>
        </div>
      </Body>
    </div>
  );
}

// Profile Settings Component
function ProfileSettings({ user }) {
  return (
    <div className="settings-section">
      <div className="section-header">
        <h3 className="section-title">Profile Information</h3>
        <p className="section-description">
          View your personal information on Solidify
        </p>
      </div>

      <div className="settings-form">
        <div className="form-group">
          <label className="form-label">Full Name</label>
          <input
            type="text"
            className="form-input"
            value={user?.fullName || `${user?.firstName || ""} ${user?.lastName || ""}`.trim()}
            disabled
          />
        </div>

        <div className="form-group">
          <label className="form-label">Email Address</label>
          <input
            type="email"
            className="form-input"
            value={user?.email || ""}
            disabled
          />
        </div>

        <div className="form-group">
          <label className="form-label">User ID</label>
          <input
            type="text"
            className="form-input"
            value={user?.userId || ""}
            disabled
          />
        </div>

        <div className="form-group">
          <label className="form-label">Organization</label>
          <input
            type="text"
            className="form-input"
            value={user?.organization?.name || ""}
            disabled
          />
        </div>

        <div className="form-group">
          <label className="form-label">Role</label>
          <input
            type="text"
            className="form-input"
            value={user?.role || ""}
            disabled
          />
        </div>
      </div>
    </div>
  );
}

// Account Settings Component
function AccountSettings({ accountData, setAccountData, onSave }) {
  return (
    <div className="settings-section">
      <div className="section-header">
        <h3 className="section-title">Change Password</h3>
        <p className="section-description">
          Update your password to keep your account secure
        </p>
      </div>

      <form onSubmit={onSave} className="settings-form">
        <div className="form-group">
          <label className="form-label">Current Password</label>
          <input
            type="password"
            className="form-input"
            value={accountData.currentPassword}
            onChange={(e) => setAccountData({ ...accountData, currentPassword: e.target.value })}
            placeholder="Enter current password"
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">New Password</label>
          <input
            type="password"
            className="form-input"
            value={accountData.newPassword}
            onChange={(e) => setAccountData({ ...accountData, newPassword: e.target.value })}
            placeholder="Enter new password"
            required
            minLength={8}
          />
          <p className="form-help">Must be at least 8 characters long</p>
        </div>

        <div className="form-group">
          <label className="form-label">Confirm New Password</label>
          <input
            type="password"
            className="form-input"
            value={accountData.confirmPassword}
            onChange={(e) => setAccountData({ ...accountData, confirmPassword: e.target.value })}
            placeholder="Confirm new password"
            required
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-primary">
            Change Password
          </button>
        </div>
      </form>
    </div>
  );
}

