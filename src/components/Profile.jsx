import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../stores/authStore";

export function Profile() {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="profile-dropdown-container" ref={dropdownRef}>
      <button
        className="profile-trigger"
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        aria-label="User menu"
      >
        <div className="profile-avatar-wrapper">
          <img
            className="profile-avatar"
            src={user?.avatarUrl || "https://i.pravatar.cc/600"}
            alt={user?.fullName || "User"}
          />
          <div className="avatar-status-dot"></div>
        </div>
        <span className="material-symbols-outlined profile-arrow">
          {isDropdownOpen ? "expand_less" : "expand_more"}
        </span>
      </button>

      {/* Dropdown Menu */}
      {isDropdownOpen && (
        <div className="profile-dropdown-menu">
          <div className="dropdown-header">
            <div className="dropdown-avatar-wrapper">
              <img
                src={user?.avatarUrl || "https://i.pravatar.cc/600"}
                alt={user?.fullName || "User"}
              />
            </div>
            <div className="dropdown-user-info">
              <p className="dropdown-name">{user?.fullName || "User"}</p>
              <p className="dropdown-email">{user?.email || "user@example.com"}</p>
              <p className="dropdown-org">{user?.organization?.name || "Organization"}</p>
            </div>
          </div>

          <div className="dropdown-divider"></div>

          <nav className="dropdown-nav">
            <button className="dropdown-item" onClick={() => { navigate("/profile"); setIsDropdownOpen(false); }}>
              <span className="material-symbols-outlined">person</span>
              <span>My Profile</span>
            </button>

            <button className="dropdown-item" onClick={() => { navigate("/settings"); setIsDropdownOpen(false); }}>
              <span className="material-symbols-outlined">settings</span>
              <span>Settings</span>
            </button>

            <button className="dropdown-item" onClick={() => { navigate("/organization"); setIsDropdownOpen(false); }}>
              <span className="material-symbols-outlined">business</span>
              <span>Organization</span>
            </button>

            <button className="dropdown-item" onClick={() => { navigate("/help"); setIsDropdownOpen(false); }}>
              <span className="material-symbols-outlined">help</span>
              <span>Help & Support</span>
            </button>
          </nav>

          <div className="dropdown-divider"></div>

          <button className="dropdown-item logout-item" onClick={handleLogout}>
            <span className="material-symbols-outlined">logout</span>
            <span>Logout</span>
          </button>
        </div>
      )}
    </div>
  );
}
