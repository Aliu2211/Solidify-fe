import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';

/**
 * AdminDashboard Component
 * Main container for admin dashboard with sidebar and content area
 */
export default function AdminDashboard() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <div className="admin-dashboard">
      <AdminSidebar collapsed={sidebarCollapsed} onToggle={toggleSidebar} />

      <div className={`admin-main ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
        <AdminHeader />

        <div className="admin-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
