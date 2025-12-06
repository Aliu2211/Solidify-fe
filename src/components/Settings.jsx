import { useState } from "react";
import { Header } from "./Header";
import { Profile } from "./Profile";
import { Body } from "./Dashboard";
import useAuthStore from "../stores/authStore";
import toast from "react-hot-toast";

export default function Settings() {
  const { user, changePassword, updateProfile, isLoading } = useAuthStore();
  const [activeSection, setActiveSection] = useState("profile");

  // Profile settings state
  const [profileData, setProfileData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
  });

  // Account settings state
  const [accountData, setAccountData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    const result = await updateProfile(profileData);
    if (result.success) {
      toast.success("Profile updated successfully!");
    }
  };

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
              <ProfileSettings
                user={user}
                profileData={profileData}
                setProfileData={setProfileData}
                onSave={handleProfileUpdate}
                isLoading={isLoading}
              />
            )}
            {activeSection === "account" && (
              <AccountSettings
                accountData={accountData}
                setAccountData={setAccountData}
                onSave={handlePasswordChange}
                isLoading={isLoading}
              />
            )}
          </main>
        </div>
      </Body>
    </div>
  );
}

// Profile Settings Component
function ProfileSettings({ user, profileData, setProfileData, onSave, isLoading }) {
  return (
    <div className="settings-section">
      <div className="section-header">
        <h3 className="section-title">Profile Information</h3>
        <p className="section-description">
          Update your personal information
        </p>
      </div>

      <form onSubmit={onSave} className="settings-form">
        <div className="form-group">
          <label className="form-label">First Name</label>
          <input
            type="text"
            className="form-input"
            value={profileData.firstName}
            onChange={(e) => setProfileData({ ...profileData, firstName: e.target.value })}
            placeholder="Enter your first name"
            required
            disabled={isLoading}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Last Name</label>
          <input
            type="text"
            className="form-input"
            value={profileData.lastName}
            onChange={(e) => setProfileData({ ...profileData, lastName: e.target.value })}
            placeholder="Enter your last name"
            required
            disabled={isLoading}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Email Address</label>
          <input
            type="email"
            className="form-input"
            value={profileData.email}
            onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
            placeholder="Enter your email"
            required
            disabled={isLoading}
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
          <p className="form-help">User ID cannot be changed</p>
        </div>

        <div className="form-group">
          <label className="form-label">Organization</label>
          <input
            type="text"
            className="form-input"
            value={user?.organization?.name || ""}
            disabled
          />
          <p className="form-help">Contact admin to change organization</p>
        </div>

        <div className="form-group">
          <label className="form-label">Role</label>
          <input
            type="text"
            className="form-input"
            value={user?.role || ""}
            disabled
          />
          <p className="form-help">Role is assigned by administrators</p>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-primary" disabled={isLoading}>
            {isLoading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}

// Account Settings Component
function AccountSettings({ accountData, setAccountData, onSave, isLoading }) {
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
          <button type="submit" className="btn-primary" disabled={isLoading}>
            {isLoading ? "Changing..." : "Change Password"}
          </button>
        </div>
      </form>
    </div>
  );
}

