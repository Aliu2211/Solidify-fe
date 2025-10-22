import { useState } from "react";
import { Header } from "./Header";
import { Profile } from "./Profile";
import { Body } from "./Dashboard";
import useAuthStore from "../stores/authStore";
import toast from "react-hot-toast";

export default function Settings() {
  const { user } = useAuthStore();
  const [activeSection, setActiveSection] = useState("profile");

  // Profile settings state
  const [profileData, setProfileData] = useState({
    fullName: user?.fullName || "",
    email: user?.email || "",
    phone: user?.phone || "",
    organization: user?.organization?.name || "",
    role: user?.role || "",
    bio: user?.bio || "",
  });

  // Account settings state
  const [accountData, setAccountData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Notification settings state
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    pushNotifications: true,
    messageNotifications: true,
    newsUpdates: true,
    sustainabilityAlerts: false,
    weeklyDigest: true,
  });

  // Privacy settings state
  const [privacy, setPrivacy] = useState({
    profileVisibility: "public",
    showEmail: false,
    showPhone: false,
    allowMessages: true,
    allowConnections: true,
  });

  // Appearance settings state
  const [appearance, setAppearance] = useState({
    theme: "light",
    fontSize: "medium",
    compactMode: false,
  });

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    // TODO: Implement API call to update profile
    toast.success("Profile updated successfully!");
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (accountData.newPassword !== accountData.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }
    // TODO: Implement API call to change password
    toast.success("Password changed successfully!");
    setAccountData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  const handleNotificationUpdate = () => {
    // TODO: Implement API call to update notification settings
    toast.success("Notification preferences updated!");
  };

  const handlePrivacyUpdate = () => {
    // TODO: Implement API call to update privacy settings
    toast.success("Privacy settings updated!");
  };

  const handleAppearanceUpdate = () => {
    // TODO: Implement theme change
    toast.success("Appearance settings updated!");
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
              <button
                className={`settings-nav-item ${activeSection === "notifications" ? "active" : ""}`}
                onClick={() => setActiveSection("notifications")}
              >
                <span className="material-symbols-outlined">notifications</span>
                Notifications
              </button>
              <button
                className={`settings-nav-item ${activeSection === "privacy" ? "active" : ""}`}
                onClick={() => setActiveSection("privacy")}
              >
                <span className="material-symbols-outlined">lock</span>
                Privacy
              </button>
              <button
                className={`settings-nav-item ${activeSection === "appearance" ? "active" : ""}`}
                onClick={() => setActiveSection("appearance")}
              >
                <span className="material-symbols-outlined">palette</span>
                Appearance
              </button>
            </nav>
          </aside>

          {/* Settings Content */}
          <main className="settings-content">
            {activeSection === "profile" && (
              <ProfileSettings
                profileData={profileData}
                setProfileData={setProfileData}
                onSave={handleProfileUpdate}
              />
            )}
            {activeSection === "account" && (
              <AccountSettings
                accountData={accountData}
                setAccountData={setAccountData}
                onSave={handlePasswordChange}
              />
            )}
            {activeSection === "notifications" && (
              <NotificationSettings
                notifications={notifications}
                setNotifications={setNotifications}
                onSave={handleNotificationUpdate}
              />
            )}
            {activeSection === "privacy" && (
              <PrivacySettings
                privacy={privacy}
                setPrivacy={setPrivacy}
                onSave={handlePrivacyUpdate}
              />
            )}
            {activeSection === "appearance" && (
              <AppearanceSettings
                appearance={appearance}
                setAppearance={setAppearance}
                onSave={handleAppearanceUpdate}
              />
            )}
          </main>
        </div>
      </Body>
    </div>
  );
}

// Profile Settings Component
function ProfileSettings({ profileData, setProfileData, onSave }) {
  return (
    <div className="settings-section">
      <div className="section-header">
        <h3 className="section-title">Profile Information</h3>
        <p className="section-description">
          Update your personal information and how others see you on Solidify
        </p>
      </div>

      <form onSubmit={onSave} className="settings-form">
        <div className="form-group">
          <label className="form-label">Full Name</label>
          <input
            type="text"
            className="form-input"
            value={profileData.fullName}
            onChange={(e) => setProfileData({ ...profileData, fullName: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Email Address</label>
          <input
            type="email"
            className="form-input"
            value={profileData.email}
            onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Phone Number</label>
          <input
            type="tel"
            className="form-input"
            value={profileData.phone}
            onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
            placeholder="+1 (555) 000-0000"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Organization</label>
          <input
            type="text"
            className="form-input"
            value={profileData.organization}
            disabled
          />
        </div>

        <div className="form-group">
          <label className="form-label">Role</label>
          <input
            type="text"
            className="form-input"
            value={profileData.role}
            disabled
          />
        </div>

        <div className="form-group">
          <label className="form-label">Bio</label>
          <textarea
            className="form-textarea"
            value={profileData.bio}
            onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
            placeholder="Tell us about yourself..."
            rows={4}
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-primary">
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}

// Account Settings Component
function AccountSettings({ accountData, setAccountData, onSave }) {
  return (
    <div className="settings-section">
      <div className="section-header">
        <h3 className="section-title">Account & Security</h3>
        <p className="section-description">
          Manage your password and account security settings
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
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-primary">
            Change Password
          </button>
        </div>
      </form>

      <div className="settings-divider"></div>

      <div className="danger-zone">
        <h4 className="danger-zone-title">Danger Zone</h4>
        <p className="danger-zone-description">
          Once you delete your account, there is no going back. Please be certain.
        </p>
        <button className="btn-danger">
          Delete Account
        </button>
      </div>
    </div>
  );
}

// Notification Settings Component
function NotificationSettings({ notifications, setNotifications, onSave }) {
  const handleToggle = (key) => {
    setNotifications({ ...notifications, [key]: !notifications[key] });
  };

  return (
    <div className="settings-section">
      <div className="section-header">
        <h3 className="section-title">Notification Preferences</h3>
        <p className="section-description">
          Choose how you want to be notified about activity on Solidify
        </p>
      </div>

      <div className="settings-list">
        <ToggleSetting
          icon="email"
          title="Email Notifications"
          description="Receive notifications via email"
          checked={notifications.emailNotifications}
          onChange={() => handleToggle("emailNotifications")}
        />
        <ToggleSetting
          icon="notifications_active"
          title="Push Notifications"
          description="Receive push notifications in your browser"
          checked={notifications.pushNotifications}
          onChange={() => handleToggle("pushNotifications")}
        />
        <ToggleSetting
          icon="chat"
          title="Message Notifications"
          description="Get notified when you receive new messages"
          checked={notifications.messageNotifications}
          onChange={() => handleToggle("messageNotifications")}
        />
        <ToggleSetting
          icon="newsstand"
          title="News Updates"
          description="Stay updated with the latest sustainability news"
          checked={notifications.newsUpdates}
          onChange={() => handleToggle("newsUpdates")}
        />
        <ToggleSetting
          icon="eco"
          title="Sustainability Alerts"
          description="Get alerts about new sustainability opportunities"
          checked={notifications.sustainabilityAlerts}
          onChange={() => handleToggle("sustainabilityAlerts")}
        />
        <ToggleSetting
          icon="mail"
          title="Weekly Digest"
          description="Receive a weekly summary of your activity"
          checked={notifications.weeklyDigest}
          onChange={() => handleToggle("weeklyDigest")}
        />
      </div>

      <div className="form-actions">
        <button onClick={onSave} className="btn-primary">
          Save Preferences
        </button>
      </div>
    </div>
  );
}

// Privacy Settings Component
function PrivacySettings({ privacy, setPrivacy, onSave }) {
  const handleToggle = (key) => {
    setPrivacy({ ...privacy, [key]: !privacy[key] });
  };

  return (
    <div className="settings-section">
      <div className="section-header">
        <h3 className="section-title">Privacy Settings</h3>
        <p className="section-description">
          Control your privacy and who can see your information
        </p>
      </div>

      <div className="form-group">
        <label className="form-label">Profile Visibility</label>
        <select
          className="form-select"
          value={privacy.profileVisibility}
          onChange={(e) => setPrivacy({ ...privacy, profileVisibility: e.target.value })}
        >
          <option value="public">Public - Everyone can see your profile</option>
          <option value="network">Network - Only your connections</option>
          <option value="private">Private - Only you</option>
        </select>
      </div>

      <div className="settings-list">
        <ToggleSetting
          icon="alternate_email"
          title="Show Email"
          description="Display your email address on your profile"
          checked={privacy.showEmail}
          onChange={() => handleToggle("showEmail")}
        />
        <ToggleSetting
          icon="phone"
          title="Show Phone"
          description="Display your phone number on your profile"
          checked={privacy.showPhone}
          onChange={() => handleToggle("showPhone")}
        />
        <ToggleSetting
          icon="mail"
          title="Allow Messages"
          description="Let others send you direct messages"
          checked={privacy.allowMessages}
          onChange={() => handleToggle("allowMessages")}
        />
        <ToggleSetting
          icon="group_add"
          title="Allow Connection Requests"
          description="Allow others to send you connection requests"
          checked={privacy.allowConnections}
          onChange={() => handleToggle("allowConnections")}
        />
      </div>

      <div className="form-actions">
        <button onClick={onSave} className="btn-primary">
          Save Privacy Settings
        </button>
      </div>
    </div>
  );
}

// Appearance Settings Component
function AppearanceSettings({ appearance, setAppearance, onSave }) {
  return (
    <div className="settings-section">
      <div className="section-header">
        <h3 className="section-title">Appearance</h3>
        <p className="section-description">
          Customize how Solidify looks on your device
        </p>
      </div>

      <div className="form-group">
        <label className="form-label">Theme</label>
        <div className="theme-options">
          <button
            className={`theme-option ${appearance.theme === "light" ? "active" : ""}`}
            onClick={() => setAppearance({ ...appearance, theme: "light" })}
          >
            <span className="material-symbols-outlined">light_mode</span>
            <span>Light</span>
          </button>
          <button
            className={`theme-option ${appearance.theme === "dark" ? "active" : ""}`}
            onClick={() => setAppearance({ ...appearance, theme: "dark" })}
          >
            <span className="material-symbols-outlined">dark_mode</span>
            <span>Dark</span>
          </button>
          <button
            className={`theme-option ${appearance.theme === "auto" ? "active" : ""}`}
            onClick={() => setAppearance({ ...appearance, theme: "auto" })}
          >
            <span className="material-symbols-outlined">brightness_auto</span>
            <span>Auto</span>
          </button>
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Font Size</label>
        <div className="font-size-options">
          <button
            className={`size-option ${appearance.fontSize === "small" ? "active" : ""}`}
            onClick={() => setAppearance({ ...appearance, fontSize: "small" })}
          >
            Small
          </button>
          <button
            className={`size-option ${appearance.fontSize === "medium" ? "active" : ""}`}
            onClick={() => setAppearance({ ...appearance, fontSize: "medium" })}
          >
            Medium
          </button>
          <button
            className={`size-option ${appearance.fontSize === "large" ? "active" : ""}`}
            onClick={() => setAppearance({ ...appearance, fontSize: "large" })}
          >
            Large
          </button>
        </div>
      </div>

      <div className="settings-list">
        <ToggleSetting
          icon="view_compact"
          title="Compact Mode"
          description="Show more content with reduced spacing"
          checked={appearance.compactMode}
          onChange={() => setAppearance({ ...appearance, compactMode: !appearance.compactMode })}
        />
      </div>

      <div className="form-actions">
        <button onClick={onSave} className="btn-primary">
          Apply Changes
        </button>
      </div>
    </div>
  );
}

// Toggle Setting Component
function ToggleSetting({ icon, title, description, checked, onChange }) {
  return (
    <div className="toggle-setting">
      <div className="toggle-setting-icon">
        <span className="material-symbols-outlined">{icon}</span>
      </div>
      <div className="toggle-setting-content">
        <h5 className="toggle-setting-title">{title}</h5>
        <p className="toggle-setting-description">{description}</p>
      </div>
      <label className="toggle-switch">
        <input type="checkbox" checked={checked} onChange={onChange} />
        <span className="toggle-slider"></span>
      </label>
    </div>
  );
}