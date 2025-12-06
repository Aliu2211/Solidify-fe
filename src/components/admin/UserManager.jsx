import { useState, useEffect } from 'react';
import useAdminStore from '../../stores/adminStore';
import useAuthStore from '../../stores/authStore';
import ConfirmationModal from '../common/ConfirmationModal';

/**
 * UserManager Component
 * Admin interface for managing users with full CRUD operations
 */
export default function UserManager() {
  const {
    users,
    usersLoading,
    fetchUsers,
    updateUser,
    deleteUser
  } = useAdminStore();

  const { register } = useAuthStore();
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [deletingUser, setDeletingUser] = useState(null);
  const [viewingUser, setViewingUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('');

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: 'user',
    organization: '',
    isVerified: true,
  });

  // Fetch users on component mount
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const openCreateModal = () => {
    setEditingUser(null);
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      role: 'user',
      organization: '',
      isVerified: true,
    });
    setShowModal(true);
  };

  const openEditModal = (user) => {
    setEditingUser(user);
    setFormData({
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      email: user.email || '',
      password: '', // Don't pre-fill password
      role: user.role || 'user',
      organization: user.organization?.orgId || user.organization?._id || '',
      isVerified: user.isVerified !== false, // Default to true if undefined
    });
    setShowModal(true);
  };

  const openDeleteModal = (user) => {
    setDeletingUser(user);
    setShowDeleteModal(true);
  };

  const openViewModal = (user) => {
    setViewingUser(user);
    setShowViewModal(true);
  };

  const closeModal = () => {
    setEditingUser(null);
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      role: 'user',
      organization: '',
      isVerified: true,
    });
    setShowModal(false);
  };

  const closeDeleteModal = () => {
    setDeletingUser(null);
    setShowDeleteModal(false);
  };

  const closeViewModal = () => {
    setViewingUser(null);
    setShowViewModal(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    let result;

    if (editingUser) {
      // Update existing user
      const updateData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        role: formData.role,
        isVerified: formData.isVerified,
      };

      // Use _id as primary identifier, fallback to userId
      result = await updateUser(editingUser._id || editingUser.userId, updateData);
    } else {
      // Create new user
      const registrationData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        organizationId: formData.organization,
      };

      result = await register(registrationData, true); // skipLogin=true
    }

    if (result.success) {
      closeModal();
      await fetchUsers({}, true); // Force refresh
    }

    setIsLoading(false);
  };

  const handleDelete = async () => {
    if (!deletingUser) return;

    // Use _id as primary identifier, fallback to userId
    const result = await deleteUser(deletingUser._id || deletingUser.userId);

    if (result.success) {
      closeDeleteModal();
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target.className === 'modal-overlay') {
      closeModal();
    }
  };

  const handleDeleteOverlayClick = (e) => {
    if (e.target.className === 'modal-overlay') {
      closeDeleteModal();
    }
  };

  const handleViewOverlayClick = (e) => {
    if (e.target.className === 'modal-overlay') {
      closeViewModal();
    }
  };

  // Filter and search users
  const filteredUsers = users.filter(user => {
    const matchesSearch = searchQuery === '' ||
      user.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.lastName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.userId?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRole = roleFilter === '' || user.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  const getRoleLabel = (role) => {
    const labels = {
      admin: 'Admin',
      manager: 'Manager',
      user: 'User',
    };
    return labels[role] || role;
  };

  const getRoleBadgeClass = (role) => {
    const classes = {
      admin: 'status-badge status-role-admin',
      manager: 'status-badge status-role-manager',
      user: 'status-badge status-role-user',
    };
    return classes[role] || 'status-badge';
  };

  return (
    <div className="user-manager-page">
      {/* Header Section */}
      <div className="admin-header-section">
        <div className="header-content">
          <div className="header-icon-wrapper">
            <span className="material-symbols-outlined header-icon">group</span>
          </div>
          <div className="header-text">
            <h1 className="admin-title">User Management</h1>
            <p className="admin-subtitle">
              Manage user accounts and permissions ({filteredUsers.length} {filteredUsers.length === 1 ? 'user' : 'users'})
            </p>
          </div>
        </div>
        <button
          className="btn-primary"
          onClick={openCreateModal}
        >
          <span className="material-symbols-outlined">person_add</span>
          Add New User
        </button>
      </div>

      {/* Search and Filter Section */}
      <div className="admin-filters">
        <div className="search-container">
          <span className="material-symbols-outlined search-icon">search</span>
          <input
            type="text"
            placeholder="Search users by name, email, or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          {searchQuery && (
            <button
              className="clear-search"
              onClick={() => setSearchQuery('')}
              aria-label="Clear search"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          )}
        </div>

        <div className="filter-group">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="filter-select"
          >
            <option value="">All Roles</option>
            <option value="admin">Admin</option>
            <option value="manager">Manager</option>
            <option value="user">User</option>
          </select>
        </div>
      </div>

      {/* Users List */}
      {usersLoading && users.length === 0 ? (
        <div className="loading-state">
          <div className="spinner-large"></div>
          <p>Loading users...</p>
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="admin-card empty-state">
          <div className="empty-state-icon">
            <span className="material-symbols-outlined">group_off</span>
          </div>
          <h3 className="empty-title">
            {searchQuery || roleFilter ? 'No Users Found' : 'No Users Yet'}
          </h3>
          <p className="empty-description">
            {searchQuery || roleFilter
              ? 'Try adjusting your search or filters to find what you\'re looking for.'
              : 'Get started by adding your first user to the platform.'}
          </p>
        </div>
      ) : (
        <div className="users-table-container">
          <table className="users-table">
            <thead>
              <tr>
                <th>User ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Organization</th>
                <th>Status</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.userId || user._id}>
                  <td>
                    <code className="user-id-code">{user.userId}</code>
                  </td>
                  <td>
                    <div className="user-name-cell">
                      <span className="material-symbols-outlined user-avatar-icon">account_circle</span>
                      {user.firstName} {user.lastName}
                    </div>
                  </td>
                  <td>{user.email}</td>
                  <td>
                    <span className={getRoleBadgeClass(user.role)}>
                      {getRoleLabel(user.role)}
                    </span>
                  </td>
                  <td>{user.organization?.name || 'N/A'}</td>
                  <td>
                    <span className={`status-badge ${user.isVerified ? 'status-verified' : 'status-unverified'}`}>
                      {user.isVerified ? 'Verified' : 'Unverified'}
                    </span>
                  </td>
                  <td>
                    {user.createdAt
                      ? new Date(user.createdAt).toLocaleDateString()
                      : 'N/A'}
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="btn-icon"
                        onClick={() => openViewModal(user)}
                        title="View details"
                      >
                        <span className="material-symbols-outlined">visibility</span>
                      </button>
                      <button
                        className="btn-icon btn-edit"
                        onClick={() => openEditModal(user)}
                        title="Edit user"
                      >
                        <span className="material-symbols-outlined">edit</span>
                      </button>
                      <button
                        className="btn-icon btn-delete"
                        onClick={() => openDeleteModal(user)}
                        title="Delete user"
                      >
                        <span className="material-symbols-outlined">delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* View User Details Modal */}
      {showViewModal && viewingUser && (
        <div className="modal-overlay" onClick={handleViewOverlayClick}>
          <div className="modal-content modal-large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>
                <span className="material-symbols-outlined">visibility</span>
                User Details
              </h3>
              <button type="button" onClick={closeViewModal}>
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="modal-body">
              <div className="detail-value-highlight">
                <span className="material-symbols-outlined">badge</span>
                <code>{viewingUser.userId || viewingUser._id}</code>
                <button
                  className="btn-copy"
                  onClick={() => {
                    navigator.clipboard.writeText(viewingUser.userId || viewingUser._id);
                  }}
                  title="Copy ID"
                >
                  <span className="material-symbols-outlined">content_copy</span>
                  Copy ID
                </button>
              </div>

              <div className="detail-grid">
                <div className="detail-group">
                  <label className="detail-label">Full Name</label>
                  <div className="detail-value">
                    {viewingUser.firstName} {viewingUser.lastName}
                  </div>
                </div>

                <div className="detail-group">
                  <label className="detail-label">Email Address</label>
                  <div className="detail-value">
                    <a href={`mailto:${viewingUser.email}`}>{viewingUser.email}</a>
                  </div>
                </div>

                <div className="detail-group">
                  <label className="detail-label">Role</label>
                  <div className="detail-value">
                    <span className={getRoleBadgeClass(viewingUser.role)}>
                      {getRoleLabel(viewingUser.role)}
                    </span>
                  </div>
                </div>

                <div className="detail-group">
                  <label className="detail-label">Account Status</label>
                  <div className="detail-value">
                    <span className={`status-badge ${viewingUser.isVerified ? 'status-verified' : 'status-unverified'}`}>
                      {viewingUser.isVerified ? 'Verified' : 'Unverified'}
                    </span>
                  </div>
                </div>

                <div className="detail-group full-width">
                  <label className="detail-label">Organization</label>
                  <div className="detail-value">
                    {viewingUser.organization?.name || 'N/A'}
                    {viewingUser.organization?.orgId && (
                      <span className="text-muted" style={{ marginLeft: '8px', fontSize: '12px' }}>
                        (ID: {viewingUser.organization.orgId})
                      </span>
                    )}
                  </div>
                </div>

                <div className="detail-group">
                  <label className="detail-label">Created At</label>
                  <div className="detail-value">
                    {viewingUser.createdAt
                      ? new Date(viewingUser.createdAt).toLocaleString()
                      : 'N/A'}
                  </div>
                </div>

                <div className="detail-group">
                  <label className="detail-label">Last Updated</label>
                  <div className="detail-value">
                    {viewingUser.updatedAt
                      ? new Date(viewingUser.updatedAt).toLocaleString()
                      : 'N/A'}
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-actions">
              <button type="button" onClick={closeViewModal}>
                <span className="material-symbols-outlined">close</span>
                Close
              </button>
              <button
                type="button"
                className="btn-primary"
                onClick={() => {
                  closeViewModal();
                  openEditModal(viewingUser);
                }}
              >
                <span className="material-symbols-outlined">edit</span>
                Edit User
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create/Edit User Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={handleOverlayClick}>
          <div className="modal-content modal-large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>
                <span className="material-symbols-outlined">
                  {editingUser ? 'edit' : 'person_add'}
                </span>
                {editingUser ? 'Edit User' : 'New User Registration'}
              </h3>
              <button type="button" onClick={closeModal}>
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="modal-form">
              {/* Personal Information Section */}
              <div className="form-section-title">
                <span className="material-symbols-outlined">person</span>
                Personal Information
              </div>
              <div className="form-row-2">
                <div className="form-group">
                  <label>
                    First Name <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="Enter first name"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>
                    Last Name <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Enter last name"
                    required
                  />
                </div>
              </div>

              {/* Account Credentials Section */}
              <div className="form-section-title">
                <span className="material-symbols-outlined">lock</span>
                Account Credentials
              </div>
              <div className="form-group">
                <label>
                  Email Address <span className="required">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="user@example.com"
                  required
                />
              </div>

              {!editingUser && (
                <div className="form-group">
                  <label>
                    Password <span className="required">*</span>
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter secure password (min 8 characters)"
                    required
                    minLength={8}
                  />
                </div>
              )}

              {/* Organization & Permissions Section */}
              <div className="form-section-title">
                <span className="material-symbols-outlined">business</span>
                Organization & Permissions
              </div>
              <div className="form-row-2">
                <div className="form-group">
                  <label>
                    Role <span className="required">*</span>
                  </label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    required
                    disabled={editingUser && !editingUser} // Can edit role for existing users
                  >
                    <option value="user">User - Basic Access</option>
                    <option value="manager">Manager - Team Management</option>
                    <option value="admin">Admin - Full Control</option>
                  </select>
                </div>

                {!editingUser && (
                  <div className="form-group">
                    <label>
                      Organization ID <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      name="organization"
                      value={formData.organization}
                      onChange={handleChange}
                      placeholder="Enter organization ID"
                      required
                    />
                  </div>
                )}

                {editingUser && (
                  <div className="form-group">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        name="isVerified"
                        checked={formData.isVerified}
                        onChange={handleChange}
                      />
                      <span>Account Verified</span>
                    </label>
                  </div>
                )}
              </div>
            </form>

            {/* Action Buttons */}
            <div className="modal-actions">
              <button
                type="button"
                onClick={closeModal}
                disabled={isLoading}
              >
                <span className="material-symbols-outlined">close</span>
                Cancel
              </button>
              <button
                type="submit"
                onClick={handleSubmit}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="spinner"></span>
                    {editingUser ? 'Updating...' : 'Creating...'}
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined">
                      {editingUser ? 'save' : 'person_add'}
                    </span>
                    {editingUser ? 'Update User' : 'Create User'}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={closeDeleteModal}
        onConfirm={handleDelete}
        title="Delete User"
        message={`Are you sure you want to delete user "${deletingUser?.firstName} ${deletingUser?.lastName}"? This action cannot be undone.`}
        confirmText="Delete User"
        isDeleting={usersLoading}
      />
    </div>
  );
}
