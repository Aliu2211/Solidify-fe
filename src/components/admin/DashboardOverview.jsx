import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAdminStore from '../../stores/adminStore';
import LoadingSpinner from '../common/LoadingSpinner';

/**
 * DashboardOverview Component
 * Admin dashboard home page with stats and quick actions
 */
export default function DashboardOverview() {
  const navigate = useNavigate();
  const { dashboardStats, statsLoading, fetchDashboardStats } = useAdminStore();

  useEffect(() => {
    // Only fetch if stats haven't been loaded yet (all values are 0)
    const hasNoStats =
      dashboardStats.totalCourses === 0 &&
      dashboardStats.totalResources === 0 &&
      dashboardStats.totalNews === 0 &&
      dashboardStats.totalOrganizations === 0;

    if (hasNoStats) {
      // Delay dashboard stats fetch to avoid rate limiting
      const timer = setTimeout(() => {
        fetchDashboardStats();
      }, 1000); // 1 second delay
      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount

  const statsCards = [
    {
      title: 'Total Courses',
      value: dashboardStats.totalCourses,
      icon: 'school',
      color: '#22c55e',
      bgColor: '#dcfce7',
      path: '/admin/courses',
    },
    {
      title: 'Library Resources',
      value: dashboardStats.totalResources,
      icon: 'folder',
      color: '#16a34a',
      bgColor: '#bbf7d0',
      path: '/admin/library',
    },
    {
      title: 'News Articles',
      value: dashboardStats.totalNews,
      icon: 'newspaper',
      color: '#15803d',
      bgColor: '#86efac',
      path: '/admin/news',
    },
    {
      title: 'Organizations',
      value: dashboardStats.totalOrganizations,
      icon: 'business',
      color: '#14532d',
      bgColor: '#4ade80',
      path: '/admin/organizations',
    },
  ];

  const quickActions = [
    {
      label: 'Create Course',
      icon: 'add_circle',
      color: '#22c55e',
      path: '/admin/courses',
    },
    {
      label: 'Upload Resource',
      icon: 'upload_file',
      color: '#16a34a',
      path: '/admin/library',
    },
    {
      label: 'Publish News',
      icon: 'post_add',
      color: '#15803d',
      path: '/admin/news',
    },
    {
      label: 'Add Organization',
      icon: 'domain_add',
      color: '#14532d',
      path: '/admin/organizations',
    },
  ];

  if (statsLoading) {
    return (
      <div className="admin-loading">
        <LoadingSpinner />
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-overview">
      {/* Welcome Section */}
      <div className="dashboard-welcome">
        <h2>Welcome to Admin Dashboard</h2>
        <p>Manage courses, resources, news, and organizations from here</p>
      </div>

      {/* Stats Cards */}
      <div className="dashboard-stats-grid">
        {statsCards.map((stat) => (
          <div
            key={stat.title}
            className="stat-card"
            onClick={() => navigate(stat.path)}
            style={{ '--stat-color': stat.color, '--stat-bg': stat.bgColor }}
          >
            <div className="stat-icon">
              <span className="material-symbols-outlined">{stat.icon}</span>
            </div>
            <div className="stat-info">
              <h3>{stat.value}</h3>
              <p>{stat.title}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="dashboard-section">
        <h3 className="section-title">Quick Actions</h3>
        <div className="quick-actions-grid">
          {quickActions.map((action) => (
            <button
              key={action.label}
              className="quick-action-btn"
              onClick={() => navigate(action.path)}
              style={{ '--action-color': action.color }}
            >
              <span className="material-symbols-outlined">{action.icon}</span>
              <span>{action.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Info Cards */}
      <div className="dashboard-info-grid">
        <div className="info-card">
          <div className="info-header">
            <span className="material-symbols-outlined">info</span>
            <h4>About Admin Dashboard</h4>
          </div>
          <p>
            This dashboard provides you with complete control over the platform's content
            and user management. Use the sidebar to navigate between different management sections.
          </p>
        </div>

        <div className="info-card">
          <div className="info-header">
            <span className="material-symbols-outlined">lock</span>
            <h4>Security Notice</h4>
          </div>
          <p>
            Admin access is restricted to authorized personnel only. All actions are logged
            for security and audit purposes.
          </p>
        </div>
      </div>
    </div>
  );
}
