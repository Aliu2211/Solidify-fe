import { useState, useEffect } from 'react';
import useAdminStore from '../../stores/adminStore';
import LoadingSpinner from '../common/LoadingSpinner';
import toast from 'react-hot-toast';

/**
 * LibraryManager Component
 * Full CRUD management for library resources
 */
export default function LibraryManager() {
  const { resources, resourcesLoading, fetchResources, createResource, updateResource, deleteResource } =
    useAdminStore();

  const [showModal, setShowModal] = useState(false);
  const [editingResource, setEditingResource] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'guide',
    fileType: 'pdf',
    fileUrl: '',
    fileSize: 0,
    thumbnailUrl: '',
    tags: [],
    level: 1,
    industry: [],
    isFeatured: false,
    isPremium: false,
  });

  useEffect(() => {
    // Stagger API calls to prevent rate limiting (2 seconds delay for second manager)
    const timer = setTimeout(() => {
      fetchResources();
    }, 2000);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount

  const categories = ['template', 'regulatory', 'case-study', 'guide', 'report', 'video', 'webinar'];
  const fileTypes = ['pdf', 'xlsx', 'docx', 'pptx', 'video', 'link'];

  const openCreateModal = () => {
    setEditingResource(null);
    setFormData({
      title: '',
      description: '',
      category: 'guide',
      fileType: 'pdf',
      fileUrl: '',
      fileSize: 0,
      thumbnailUrl: '',
      tags: [],
      level: 1,
      industry: [],
      isFeatured: false,
      isPremium: false,
    });
    setShowModal(true);
  };

  const openEditModal = (resource) => {
    setEditingResource(resource);
    setFormData({
      title: resource.title || '',
      description: resource.description || '',
      category: resource.category || 'guide',
      fileType: resource.fileType || 'pdf',
      fileUrl: resource.fileUrl || '',
      fileSize: resource.fileSize || 0,
      thumbnailUrl: resource.thumbnailUrl || '',
      tags: resource.tags || [],
      level: resource.level || 1,
      industry: resource.industry || [],
      isFeatured: resource.isFeatured || false,
      isPremium: resource.isPremium || false,
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingResource(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTagsChange = (e) => {
    const tags = e.target.value.split(',').map((tag) => tag.trim());
    setFormData((prev) => ({ ...prev, tags }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.description || !formData.fileUrl) {
      toast.error('Please fill in all required fields');
      return;
    }

    const resourceData = {
      ...formData,
      fileSize: parseInt(formData.fileSize) || 0,
    };

    // Generate resourceId for new resources (backend requires it despite API docs)
    if (!editingResource) {
      // Generate a unique resourceId: LIB + timestamp
      const timestamp = Date.now().toString().slice(-6);
      resourceData.resourceId = `LIB${timestamp}`;
    }

    const result = editingResource
      ? await updateResource(editingResource._id, resourceData)
      : await createResource(resourceData);

    if (result.success) {
      closeModal();
    }
  };

  const handleDelete = async (id) => {
    const result = await deleteResource(id);
    if (result.success) {
      setShowDeleteConfirm(null);
    }
  };

  // Filter and search logic
  const filteredResources = resources.filter((resource) => {
    const matchesSearch =
      resource.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === 'all' || resource.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  if (resourcesLoading && resources.length === 0) {
    return (
      <div className="admin-loading">
        <LoadingSpinner />
        <p>Loading resources...</p>
      </div>
    );
  }

  return (
    <div className="admin-manager">
      <div className="manager-header">
        <div className="manager-title">
          <h2>Library Resource Management</h2>
          <p>Upload and manage educational resources</p>
        </div>
        <button className="btn-primary" onClick={openCreateModal}>
          <span className="material-symbols-outlined">add</span>
          Upload Resource
        </button>
      </div>

      {/* Filters */}
      <div className="manager-filters">
        <div className="filter-search">
          <span className="material-symbols-outlined">search</span>
          <input
            type="text"
            placeholder="Search resources..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
          <option value="all">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* Resources Grid */}
      {filteredResources.length === 0 ? (
        <div className="manager-empty">
          <span className="material-symbols-outlined">folder</span>
          <h3>No resources found</h3>
          <p>Upload your first resource to get started</p>
        </div>
      ) : (
        <div className="manager-grid">
          {filteredResources.map((resource) => (
            <div key={resource._id} className="manager-card">
              <div className="card-header">
                <div className="card-category">{resource.category}</div>
                <div className="card-actions">
                  <button onClick={() => openEditModal(resource)} title="Edit">
                    <span className="material-symbols-outlined">edit</span>
                  </button>
                  <button onClick={() => setShowDeleteConfirm(resource._id)} title="Delete">
                    <span className="material-symbols-outlined">delete</span>
                  </button>
                </div>
              </div>
              <h3>{resource.title}</h3>
              <p>{resource.description}</p>
              <div className="card-meta">
                <span className="file-type-badge">{resource.fileType}</span>
                <span className="file-size">{(resource.fileSize / 1024).toFixed(1)} KB</span>
              </div>
              {resource.tags && resource.tags.length > 0 && (
                <div className="card-tags">
                  {resource.tags.map((tag, i) => (
                    <span key={i} className="tag">
                      {tag}
                    </span>
                  ))}
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
                  {editingResource ? 'edit_document' : 'upload_file'}
                </span>
                {editingResource ? 'Edit Resource' : 'Upload New Resource'}
              </h3>
              <button type="button" onClick={closeModal}>
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-section-title">
                <span className="material-symbols-outlined">info</span>
                Resource Details
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>
                    Title <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>
                    Description <span className="required">*</span>
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="4"
                    required
                  />
                </div>
              </div>

              <div className="form-section-title">
                <span className="material-symbols-outlined">category</span>
                Classification
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label>
                    Category <span className="required">*</span>
                  </label>
                  <select name="category" value={formData.category} onChange={handleInputChange} required>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>
                    File Type <span className="required">*</span>
                  </label>
                  <select name="fileType" value={formData.fileType} onChange={handleInputChange} required>
                    {fileTypes.map((type) => (
                      <option key={type} value={type}>
                        {type.toUpperCase()}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-section-title">
                <span className="material-symbols-outlined">link</span>
                File Information
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label>
                    File URL <span className="required">*</span>
                  </label>
                  <input
                    type="url"
                    name="fileUrl"
                    value={formData.fileUrl}
                    onChange={handleInputChange}
                    placeholder="https://..."
                    required
                  />
                </div>

                <div className="form-group">
                  <label>File Size (bytes)</label>
                  <input
                    type="number"
                    name="fileSize"
                    value={formData.fileSize}
                    onChange={handleInputChange}
                    min="0"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Thumbnail URL</label>
                  <input
                    type="url"
                    name="thumbnailUrl"
                    value={formData.thumbnailUrl}
                    onChange={handleInputChange}
                    placeholder="https://..."
                  />
                </div>
              </div>

              <div className="form-section-title">
                <span className="material-symbols-outlined">tune</span>
                Additional Settings
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label>Sustainability Level</label>
                  <select name="level" value={formData.level} onChange={(e) => setFormData({ ...formData, level: parseInt(e.target.value) })}>
                    <option value={1}>Foundation</option>
                    <option value={2}>Efficiency</option>
                    <option value={3}>Transformation</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Featured Resource</label>
                  <select
                    name="isFeatured"
                    value={formData.isFeatured.toString()}
                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.value === 'true' })}
                  >
                    <option value="false">No</option>
                    <option value="true">Yes</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Tags (comma-separated)</label>
                  <input
                    type="text"
                    value={formData.tags.join(', ')}
                    onChange={handleTagsChange}
                    placeholder="carbon, sustainability, guide"
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
                  {editingResource ? 'check_circle' : 'cloud_upload'}
                </span>
                {editingResource ? 'Update Resource' : 'Upload Resource'}
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
                Are you sure you want to delete this resource? This action cannot be undone and will permanently remove the resource from your library.
              </p>
            </div>
            <div className="modal-actions">
              <button type="button" onClick={() => setShowDeleteConfirm(null)}>
                <span className="material-symbols-outlined">close</span>
                Cancel
              </button>
              <button type="submit" onClick={() => handleDelete(showDeleteConfirm)}>
                <span className="material-symbols-outlined">delete</span>
                Delete Resource
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
