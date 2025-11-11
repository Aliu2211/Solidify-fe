import { useState } from 'react';
import useAuthStore from '../../stores/authStore';
import toast from 'react-hot-toast';

/**
 * UserManager Component
 * Admin interface for registering new users
 */
export default function UserManager() {
  const { register } = useAuthStore();
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: 'user',
    organization: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Transform data for backend API (role is not sent, it's assigned by backend)
    const registrationData = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      password: formData.password,
      organizationId: formData.organization, // Backend expects organizationId
    };

    const result = await register(registrationData, true); // skipLogin=true for admin user creation

    if (result.success) {
      toast.success('User registered successfully!');
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        role: 'user',
        organization: '',
      });
      setShowModal(false);
    }

    setIsLoading(false);
  };

  const handleCancel = () => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      role: 'user',
      organization: '',
    });
    setShowModal(false);
  };

  const handleOverlayClick = (e) => {
    if (e.target.className === 'modal-overlay') {
      handleCancel();
    }
  };

  return (
    <div className="admin-content">
      {/* Header Section */}
      <div className="admin-header-section">
        <div className="header-content">
          <div className="header-icon-wrapper">
            <span className="material-symbols-outlined header-icon">group</span>
          </div>
          <div className="header-text">
            <h1 className="admin-title">User Management</h1>
            <p className="admin-subtitle">Create and manage user accounts for your organization</p>
          </div>
        </div>
        <button
          className="btn-primary"
          onClick={() => setShowModal(true)}
        >
          <span className="material-symbols-outlined">person_add</span>
          Add New User
        </button>
      </div>

      {/* Registration Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={handleOverlayClick}>
          <div className="modal-content modal-large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>
                <span className="material-symbols-outlined">person_add</span>
                New User Registration
              </h3>
              <button type="button" onClick={handleCancel}>
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

              <div className="form-group">
                <label>
                  Password <span className="required">*</span>
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter secure password (min 8 characters)"
                  required
                  minLength={8}
                />
              </div>

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
                  >
                    <option value="user">User - Basic Access</option>
                    <option value="manager">Manager - Team Management</option>
                    <option value="admin">Admin - Full Control</option>
                  </select>
                </div>

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
              </div>
            </form>

            {/* Action Buttons */}
            <div className="modal-actions">
              <button
                type="button"
                onClick={handleCancel}
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
                    Creating Account...
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined">person_add</span>
                    Create User Account
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!showModal && (
        <div className="admin-card empty-state">
          <div className="empty-state-icon">
            <span className="material-symbols-outlined">group_add</span>
          </div>
          <h3 className="empty-title">Ready to Add Users</h3>
          <p className="empty-description">
            Register new team members to give them access to the Solidify platform.
            <br />
            Click the "Add New User" button above to get started.
          </p>
        </div>
      )}
    </div>
  );
}
