import { NavLink } from 'react-router-dom';
import darkLogo from '../../assets/logo-dark.svg';

/**
 * AdminSidebar Component
 * Navigation sidebar for admin dashboard
 */
export default function AdminSidebar({ collapsed, onToggle }) {
  const navItems = [
    {
      path: '/admin',
      label: 'Dashboard',
      icon: 'dashboard',
      end: true,
    },
    {
      path: '/admin/courses',
      label: 'Courses',
      icon: 'school',
    },
    {
      path: '/admin/library',
      label: 'Library',
      icon: 'folder',
    },
    {
      path: '/admin/news',
      label: 'News',
      icon: 'newspaper',
    },
    {
      path: '/admin/knowledge',
      label: 'Knowledge',
      icon: 'lightbulb',
    },
    {
      path: '/admin/organizations',
      label: 'Organizations',
      icon: 'business',
    },
  ];

  return (
    <div className={`admin-sidebar ${collapsed ? 'collapsed' : ''}`}>
      {/* Logo and Toggle */}
      <div className="admin-sidebar-header">
        {!collapsed && (
          <div className="admin-logo">
            <img src={darkLogo} alt="Solidify Admin" />
            <span className="admin-badge">Admin</span>
          </div>
        )}
        <button className="sidebar-toggle" onClick={onToggle} title={collapsed ? 'Expand' : 'Collapse'}>
          <span className="material-symbols-outlined">
            {collapsed ? 'menu_open' : 'menu'}
          </span>
        </button>
      </div>

      {/* Navigation */}
      <nav className="admin-nav">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.end}
            className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
            title={collapsed ? item.label : ''}
          >
            <span className="material-symbols-outlined nav-icon">{item.icon}</span>
            {!collapsed && <span className="nav-label">{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="admin-sidebar-footer">
        <NavLink
          to="/home"
          className="admin-nav-item"
          title={collapsed ? 'Back to App' : ''}
        >
          <span className="material-symbols-outlined nav-icon">arrow_back</span>
          {!collapsed && <span className="nav-label">Back to App</span>}
        </NavLink>
      </div>
    </div>
  );
}
