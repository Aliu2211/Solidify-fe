import { useState, useEffect } from 'react';
import useAdminStore from '../../stores/adminStore';
import LoadingSpinner from '../common/LoadingSpinner';
import toast from 'react-hot-toast';

/**
 * OrganizationManager Component
 * Full CRUD management for organizations
 */
export default function OrganizationManager() {
  const { organizations, organizationsLoading, fetchOrganizations, createOrganization, updateOrganization, deleteOrganization } =
    useAdminStore();

  const [showModal, setShowModal] = useState(false);
  const [editingOrganization, setEditingOrganization] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterIndustry, setFilterIndustry] = useState('all');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [viewingOrganization, setViewingOrganization] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    industryType: 'Technology',
    size: 'medium',
    location: '',
    registrationNumber: '',
    website: '',
    logoUrl: '',
  });

  useEffect(() => {
    // Stagger API calls to prevent rate limiting (1200ms delay for fifth manager)
    const timer = setTimeout(() => {
      fetchOrganizations();
    }, 1200);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount

  const industries = [
    'Technology',
    'Manufacturing',
    'Healthcare',
    'Finance',
    'Retail',
    'Energy',
    'Transportation',
    'Construction',
    'Agriculture',
    'Education',
    'Other'
  ];

  const openCreateModal = () => {
    setEditingOrganization(null);
    setFormData({
      name: '',
      description: '',
      industryType: 'Technology',
      size: 'medium',
      location: '',
      registrationNumber: '',
      website: '',
      logoUrl: '',
    });
    setShowModal(true);
  };

  const openEditModal = (org) => {
    setEditingOrganization(org);
    setFormData({
      name: org.name || '',
      description: org.description || '',
      industryType: org.industryType || 'Technology',
      size: org.size || 'medium',
      location: org.location || '',
      registrationNumber: org.registrationNumber || '',
      website: org.website || '',
      logoUrl: org.logoUrl || '',
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingOrganization(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.industryType || !formData.size || !formData.location || !formData.registrationNumber) {
      toast.error('Please fill in all required fields');
      return;
    }

    const orgData = { ...formData };

    const result = editingOrganization
      ? await updateOrganization(editingOrganization._id, orgData)
      : await createOrganization(orgData);

    if (result.success) {
      closeModal();
    }
  };

  const handleDelete = async (id) => {
    const result = await deleteOrganization(id);
    if (result.success) {
      setShowDeleteConfirm(null);
    }
  };

  const filteredOrganizations = organizations.filter((org) => {
    const matchesSearch =
      org.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      org.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesIndustry = filterIndustry === 'all' || org.industryType === filterIndustry;
    return matchesSearch && matchesIndustry;
  });

  if (organizationsLoading && organizations.length === 0) {
    return (
      <div className="admin-loading">
        <LoadingSpinner />
        <p>Loading organizations...</p>
      </div>
    );
  }

  return (
    <div className="admin-manager">
      <div className="manager-header">
        <div className="manager-title">
          <h2>Organization Management</h2>
          <p>Register and manage organizations</p>
        </div>
        <button className="btn-primary" onClick={openCreateModal}>
          <span className="material-symbols-outlined">add</span>
          Add Organization
        </button>
      </div>

      {/* Filters */}
      <div className="manager-filters">
        <div className="filter-search">
          <span className="material-symbols-outlined">search</span>
          <input
            type="text"
            placeholder="Search organizations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <select value={filterIndustry} onChange={(e) => setFilterIndustry(e.target.value)}>
          <option value="all">All Industries</option>
          {industries.map((industry) => (
            <option key={industry} value={industry}>
              {industry}
            </option>
          ))}
        </select>
      </div>

      {/* Organizations Grid */}
      {filteredOrganizations.length === 0 ? (
        <div className="manager-empty">
          <span className="material-symbols-outlined">business</span>
          <h3>No organizations found</h3>
          <p>Register your first organization to get started</p>
        </div>
      ) : (
        <div className="manager-grid">
          {filteredOrganizations.map((org) => (
            <div key={org._id} className="manager-card">
              <div className="card-header">
                <div className="card-category">{org.industry}</div>
                <div className="card-actions">
                  <button onClick={() => setViewingOrganization(org)} title="View Details">
                    <span className="material-symbols-outlined">visibility</span>
                  </button>
                  <button onClick={() => openEditModal(org)} title="Edit">
                    <span className="material-symbols-outlined">edit</span>
                  </button>
                  <button onClick={() => setShowDeleteConfirm(org._id)} title="Delete">
                    <span className="material-symbols-outlined">delete</span>
                  </button>
                </div>
              </div>
              <h3>{org.name}</h3>
              <p>{org.description?.substring(0, 100) || 'No description'}...</p>
              <div className="card-meta">
                <span className="status-badge status-published">
                  {org.size === 'small' ? 'Small' : 'Medium'}
                </span>
                <span className="author-badge">
                  <span className="material-symbols-outlined">location_on</span>
                  {org.location}
                </span>
              </div>
              {org.website && (
                <div className="card-tags">
                  <a href={org.website} target="_blank" rel="noopener noreferrer" className="tag">
                    <span className="material-symbols-outlined">link</span>
                    Website
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content modal-large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>
                <span className="material-symbols-outlined">
                  {editingOrganization ? 'edit' : 'business'}
                </span>
                {editingOrganization ? 'Edit Organization' : 'Register New Organization'}
              </h3>
              <button type="button" onClick={closeModal}>
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="modal-form">
              {/* Basic Information */}
              <div className="form-section-title">
                <span className="material-symbols-outlined">info</span>
                Basic Information
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>
                    Organization Name <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter organization name"
                  />
                </div>
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label>
                    Industry Type <span className="required">*</span>
                  </label>
                  <select name="industryType" value={formData.industryType} onChange={handleInputChange} required>
                    {industries.map((ind) => (
                      <option key={ind} value={ind}>
                        {ind}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>
                    Organization Size <span className="required">*</span>
                  </label>
                  <select name="size" value={formData.size} onChange={handleInputChange} required>
                    <option value="small">Small</option>
                    <option value="medium">Medium</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>
                    Location <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    required
                    placeholder="Accra, Greater Accra, Ghana"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>
                    Registration Number <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    name="registrationNumber"
                    value={formData.registrationNumber}
                    onChange={handleInputChange}
                    required
                    placeholder="GH-123456789"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="3"
                    placeholder="Brief description of the organization"
                  />
                </div>
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label>Website</label>
                  <input
                    type="url"
                    name="website"
                    value={formData.website}
                    onChange={handleInputChange}
                    placeholder="https://..."
                  />
                </div>

                <div className="form-group">
                  <label>Logo URL</label>
                  <input
                    type="url"
                    name="logoUrl"
                    value={formData.logoUrl}
                    onChange={handleInputChange}
                    placeholder="https://..."
                  />
                </div>
              </div>


            </form>

            <div className="modal-actions">
              <button type="button" onClick={closeModal}>
                <span className="material-symbols-outlined">close</span>
                Cancel
              </button>
              <button type="submit" onClick={handleSubmit}>
                <span className="material-symbols-outlined">
                  {editingOrganization ? 'check_circle' : 'add_business'}
                </span>
                {editingOrganization ? 'Update Organization' : 'Register Organization'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {showDeleteConfirm && (
        <div className="modal-overlay delete-modal" onClick={() => setShowDeleteConfirm(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>
                <span className="material-symbols-outlined">warning</span>
                Confirm Delete
              </h3>
              <button type="button" onClick={() => setShowDeleteConfirm(null)}>
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="modal-form">
              <p style={{ margin: 0, fontSize: '15px', color: '#6b7280', lineHeight: '1.6' }}>
                Are you sure you want to delete this organization? This action cannot be undone and will permanently remove all associated data.
              </p>
            </div>
            <div className="modal-actions">
              <button type="button" onClick={() => setShowDeleteConfirm(null)}>
                <span className="material-symbols-outlined">close</span>
                Cancel
              </button>
              <button type="submit" onClick={() => handleDelete(showDeleteConfirm)}>
                <span className="material-symbols-outlined">delete</span>
                Delete Organization
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Details Modal */}
      {viewingOrganization && (
        <div className="modal-overlay" onClick={() => setViewingOrganization(null)}>
          <div className="modal-content modal-large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>
                <span className="material-symbols-outlined">info</span>
                Organization Details
              </h3>
              <button type="button" onClick={() => setViewingOrganization(null)}>
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="modal-form">
              {/* Organization ID Section */}
              <div className="form-section-title">
                <span className="material-symbols-outlined">badge</span>
                Organization ID
              </div>
              <div className="detail-group">
                <div className="detail-label">ID (Use this for user registration)</div>
                <div className="detail-value-highlight">
                  <code>{viewingOrganization._id}</code>
                  <button
                    className="btn-copy"
                    onClick={() => {
                      navigator.clipboard.writeText(viewingOrganization._id);
                      toast.success('Organization ID copied to clipboard!');
                    }}
                    title="Copy to clipboard"
                  >
                    <span className="material-symbols-outlined">content_copy</span>
                  </button>
                </div>
              </div>

              {/* Basic Information */}
              <div className="form-section-title">
                <span className="material-symbols-outlined">info</span>
                Basic Information
              </div>
              <div className="detail-grid">
                <div className="detail-group full-width">
                  <div className="detail-label">Name</div>
                  <div className="detail-value">{viewingOrganization.name}</div>
                </div>
                <div className="detail-group">
                  <div className="detail-label">Industry Type</div>
                  <div className="detail-value">{viewingOrganization.industryType}</div>
                </div>
                <div className="detail-group">
                  <div className="detail-label">Size</div>
                  <div className="detail-value">{viewingOrganization.size === 'small' ? 'Small' : 'Medium'}</div>
                </div>
                <div className="detail-group full-width">
                  <div className="detail-label">Location</div>
                  <div className="detail-value">{viewingOrganization.location}</div>
                </div>
                <div className="detail-group full-width">
                  <div className="detail-label">Registration Number</div>
                  <div className="detail-value">{viewingOrganization.registrationNumber}</div>
                </div>
                <div className="detail-group full-width">
                  <div className="detail-label">Description</div>
                  <div className="detail-value">{viewingOrganization.description || 'N/A'}</div>
                </div>
                {viewingOrganization.website && (
                  <div className="detail-group full-width">
                    <div className="detail-label">Website</div>
                    <div className="detail-value">
                      <a href={viewingOrganization.website} target="_blank" rel="noopener noreferrer">
                        {viewingOrganization.website}
                      </a>
                    </div>
                  </div>
                )}
                {viewingOrganization.logoUrl && (
                  <div className="detail-group full-width">
                    <div className="detail-label">Logo</div>
                    <div className="detail-value">
                      <img src={viewingOrganization.logoUrl} alt={viewingOrganization.name} style={{ maxWidth: '200px', borderRadius: '8px', marginTop: '8px' }} />
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="modal-actions">
              <button type="button" onClick={() => setViewingOrganization(null)}>
                <span className="material-symbols-outlined">close</span>
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  setViewingOrganization(null);
                  openEditModal(viewingOrganization);
                }}
              >
                <span className="material-symbols-outlined">edit</span>
                Edit Organization
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
