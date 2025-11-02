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

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    industry: 'Technology',
    website: '',
    contactEmail: '',
    contactPhone: '',
    address: {
      street: '',
      city: '',
      state: '',
      country: '',
      postalCode: '',
    },
    carbonFootprint: {
      total: 0,
      unit: 'tCO2e',
    },
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
      industry: 'Technology',
      website: '',
      contactEmail: '',
      contactPhone: '',
      address: {
        street: '',
        city: '',
        state: '',
        country: '',
        postalCode: '',
      },
      carbonFootprint: {
        total: 0,
        unit: 'tCO2e',
      },
    });
    setShowModal(true);
  };

  const openEditModal = (org) => {
    setEditingOrganization(org);
    setFormData({
      name: org.name || '',
      description: org.description || '',
      industry: org.industry || 'Technology',
      website: org.website || '',
      contactEmail: org.contactEmail || '',
      contactPhone: org.contactPhone || '',
      address: org.address || {
        street: '',
        city: '',
        state: '',
        country: '',
        postalCode: '',
      },
      carbonFootprint: org.carbonFootprint || {
        total: 0,
        unit: 'tCO2e',
      },
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

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      address: { ...prev.address, [name]: value },
    }));
  };

  const handleCarbonFootprintChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      carbonFootprint: { ...prev.carbonFootprint, [name]: name === 'total' ? parseFloat(value) || 0 : value },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.contactEmail) {
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
    const matchesIndustry = filterIndustry === 'all' || org.industry === filterIndustry;
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
        <div className="filter-buttons">
          <button
            className={filterIndustry === 'all' ? 'active' : ''}
            onClick={() => setFilterIndustry('all')}
          >
            All
          </button>
          {industries.slice(0, 5).map((industry) => (
            <button
              key={industry}
              className={filterIndustry === industry ? 'active' : ''}
              onClick={() => setFilterIndustry(industry)}
            >
              {industry}
            </button>
          ))}
        </div>
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
                  <button onClick={() => openEditModal(org)} title="Edit">
                    <span className="material-symbols-outlined">edit</span>
                  </button>
                  <button onClick={() => setShowDeleteConfirm(org._id)} title="Delete">
                    <span className="material-symbols-outlined">delete</span>
                  </button>
                </div>
              </div>
              <h3>{org.name}</h3>
              <p>{org.description?.substring(0, 100)}...</p>
              <div className="card-meta">
                <span className="status-badge status-published">
                  Active
                </span>
                {org.carbonFootprint && (
                  <span className="author-badge">
                    <span className="material-symbols-outlined">eco</span>
                    {org.carbonFootprint.total} {org.carbonFootprint.unit}
                  </span>
                )}
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
              <h3>{editingOrganization ? 'Edit Organization' : 'Register New Organization'}</h3>
              <button onClick={closeModal}>
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              {/* Basic Information */}
              <div className="form-section-title">Basic Information</div>

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
                  <label>Industry</label>
                  <select name="industry" value={formData.industry} onChange={handleInputChange}>
                    {industries.map((ind) => (
                      <option key={ind} value={ind}>
                        {ind}
                      </option>
                    ))}
                  </select>
                </div>

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
              </div>

              {/* Contact Information */}
              <div className="form-section-title">Contact Information</div>

              <div className="form-row-2">
                <div className="form-group">
                  <label>
                    Contact Email <span className="required">*</span>
                  </label>
                  <input
                    type="email"
                    name="contactEmail"
                    value={formData.contactEmail}
                    onChange={handleInputChange}
                    required
                    placeholder="contact@organization.com"
                  />
                </div>

                <div className="form-group">
                  <label>Contact Phone</label>
                  <input
                    type="tel"
                    name="contactPhone"
                    value={formData.contactPhone}
                    onChange={handleInputChange}
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
              </div>

              {/* Address */}
              <div className="form-section-title">Address</div>

              <div className="form-row">
                <div className="form-group">
                  <label>Street Address</label>
                  <input
                    type="text"
                    name="street"
                    value={formData.address.street}
                    onChange={handleAddressChange}
                    placeholder="123 Main Street"
                  />
                </div>
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label>City</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.address.city}
                    onChange={handleAddressChange}
                    placeholder="City"
                  />
                </div>

                <div className="form-group">
                  <label>State/Province</label>
                  <input
                    type="text"
                    name="state"
                    value={formData.address.state}
                    onChange={handleAddressChange}
                    placeholder="State"
                  />
                </div>
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label>Country</label>
                  <input
                    type="text"
                    name="country"
                    value={formData.address.country}
                    onChange={handleAddressChange}
                    placeholder="Country"
                  />
                </div>

                <div className="form-group">
                  <label>Postal Code</label>
                  <input
                    type="text"
                    name="postalCode"
                    value={formData.address.postalCode}
                    onChange={handleAddressChange}
                    placeholder="12345"
                  />
                </div>
              </div>

              {/* Carbon Footprint */}
              <div className="form-section-title">Carbon Footprint</div>

              <div className="form-row-2">
                <div className="form-group">
                  <label>Total Carbon Emissions</label>
                  <input
                    type="number"
                    name="total"
                    value={formData.carbonFootprint.total}
                    onChange={handleCarbonFootprintChange}
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                  />
                </div>

                <div className="form-group">
                  <label>Unit</label>
                  <select
                    name="unit"
                    value={formData.carbonFootprint.unit}
                    onChange={handleCarbonFootprintChange}
                  >
                    <option value="tCO2e">tCO2e</option>
                    <option value="kgCO2e">kgCO2e</option>
                    <option value="lbs">lbs</option>
                  </select>
                </div>
              </div>

              <div className="modal-actions">
                <button type="button" onClick={closeModal} className="btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  {editingOrganization ? 'Update Organization' : 'Register Organization'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {showDeleteConfirm && (
        <div className="modal-overlay" onClick={() => setShowDeleteConfirm(null)}>
          <div className="modal-content modal-small" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Confirm Delete</h3>
            </div>
            <p>Are you sure you want to delete this organization? This action cannot be undone.</p>
            <div className="modal-actions">
              <button onClick={() => setShowDeleteConfirm(null)} className="btn-secondary">
                Cancel
              </button>
              <button onClick={() => handleDelete(showDeleteConfirm)} className="btn-delete">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
