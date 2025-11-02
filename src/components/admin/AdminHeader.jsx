import { useLocation } from 'react-router-dom';
import useAuthStore from '../../stores/authStore';

/**
 * AdminHeader Component
 * Top bar for admin dashboard with breadcrumbs and user info
 */
export default function AdminHeader() {
  const location = useLocation();
  const { user, logout } = useAuthStore();

  // Generate breadcrumb from current path
  const getBreadcrumb = () => {
    const path = location.pathname;
    const segments = path.split('/').filter(Boolean);

    if (segments.length === 1) return 'Dashboard';
    if (segments.length === 2) {
      const page = segments[1];
      return page.charAt(0).toUpperCase() + page.slice(1);
    }
    return 'Admin';
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="admin-header">
      <div className="admin-breadcrumb">
        <span className="material-symbols-outlined">admin_panel_settings</span>
        <h1>{getBreadcrumb()}</h1>
      </div>

      <div className="admin-header-actions">
        <div className="admin-user-info">
          <div className="user-avatar">
            <span className="material-symbols-outlined">person</span>
          </div>
          <div className="user-details">
            <span className="user-name">{user?.firstName} {user?.lastName}</span>
            <span className="user-role">{user?.role}</span>
          </div>
        </div>

        <button className="admin-logout-btn" onClick={handleLogout} title="Logout">
          <span className="material-symbols-outlined">logout</span>
        </button>
      </div>
    </header>
  );
}
