import { useState, useEffect } from 'react';
import useAdminStore from '../../stores/adminStore';
import LoadingSpinner from '../common/LoadingSpinner';
import toast from 'react-hot-toast';

/**
 * KnowledgeManager Component
 * Full CRUD management for knowledge base articles
 */
export default function KnowledgeManager() {
  const { knowledge, knowledgeLoading, fetchKnowledge, createKnowledge, updateKnowledge, deleteKnowledge } =
    useAdminStore();

  const [showModal, setShowModal] = useState(false);
  const [editingKnowledge, setEditingKnowledge] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'General',
    tags: [],
    relatedArticles: [],
  });

  useEffect(() => {
    // Stagger API calls to prevent rate limiting (900ms delay for fourth manager)
    const timer = setTimeout(() => {
      fetchKnowledge();
    }, 900);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount

  const categories = ['General', 'Sustainability', 'Carbon Tracking', 'Best Practices', 'Reporting', 'Compliance', 'Technology'];

  const openCreateModal = () => {
    setEditingKnowledge(null);
    setFormData({
      title: '',
      content: '',
      category: 'General',
      tags: [],
      relatedArticles: [],
    });
    setShowModal(true);
  };

  const openEditModal = (article) => {
    setEditingKnowledge(article);
    setFormData({
      title: article.title || '',
      content: article.content || '',
      category: article.category || 'General',
      tags: article.tags || [],
      relatedArticles: article.relatedArticles || [],
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingKnowledge(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTagsChange = (e) => {
    const tags = e.target.value.split(',').map((tag) => tag.trim()).filter(tag => tag);
    setFormData((prev) => ({ ...prev, tags }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.content) {
      toast.error('Please fill in all required fields');
      return;
    }

    const knowledgeData = { ...formData };

    const result = editingKnowledge
      ? await updateKnowledge(editingKnowledge.slug, knowledgeData)
      : await createKnowledge(knowledgeData);

    if (result.success) {
      closeModal();
    }
  };

  const handleDelete = async (slug) => {
    const result = await deleteKnowledge(slug);
    if (result.success) {
      setShowDeleteConfirm(null);
    }
  };

  const filteredKnowledge = knowledge.filter((article) => {
    const matchesSearch =
      article.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.content?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === 'all' || article.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  if (knowledgeLoading && knowledge.length === 0) {
    return (
      <div className="admin-loading">
        <LoadingSpinner />
        <p>Loading knowledge articles...</p>
      </div>
    );
  }

  return (
    <div className="admin-manager">
      <div className="manager-header">
        <div className="manager-title">
          <h2>Knowledge Base Management</h2>
          <p>Create and manage knowledge articles</p>
        </div>
        <button className="btn-primary" onClick={openCreateModal}>
          <span className="material-symbols-outlined">add</span>
          Add Article
        </button>
      </div>

      {/* Filters */}
      <div className="manager-filters">
        <div className="filter-search">
          <span className="material-symbols-outlined">search</span>
          <input
            type="text"
            placeholder="Search knowledge articles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="filter-buttons">
          <button
            className={filterCategory === 'all' ? 'active' : ''}
            onClick={() => setFilterCategory('all')}
          >
            All
          </button>
          {categories.map((category) => (
            <button
              key={category}
              className={filterCategory === category ? 'active' : ''}
              onClick={() => setFilterCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Knowledge Grid */}
      {filteredKnowledge.length === 0 ? (
        <div className="manager-empty">
          <span className="material-symbols-outlined">lightbulb</span>
          <h3>No knowledge articles found</h3>
          <p>Create your first article to build your knowledge base</p>
        </div>
      ) : (
        <div className="manager-grid">
          {filteredKnowledge.map((article) => (
            <div key={article.slug || article._id} className="manager-card">
              <div className="card-header">
                <div className="card-category">{article.category}</div>
                <div className="card-actions">
                  <button onClick={() => openEditModal(article)} title="Edit">
                    <span className="material-symbols-outlined">edit</span>
                  </button>
                  <button onClick={() => setShowDeleteConfirm(article.slug)} title="Delete">
                    <span className="material-symbols-outlined">delete</span>
                  </button>
                </div>
              </div>
              <h3>{article.title}</h3>
              <p>{article.content?.substring(0, 120)}...</p>
              <div className="card-meta">
                <span className="status-badge status-published">
                  Knowledge
                </span>
                {article.views !== undefined && (
                  <span className="author-badge">
                    <span className="material-symbols-outlined">visibility</span>
                    {article.views} views
                  </span>
                )}
              </div>
              {article.tags && article.tags.length > 0 && (
                <div className="card-tags">
                  {article.tags.map((tag, i) => (
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
              <h3>{editingKnowledge ? 'Edit Knowledge Article' : 'Create New Article'}</h3>
              <button onClick={closeModal}>
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleSubmit}>
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
                    placeholder="Enter article title"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>
                    Content <span className="required">*</span>
                  </label>
                  <textarea
                    name="content"
                    value={formData.content}
                    onChange={handleInputChange}
                    rows="12"
                    required
                    placeholder="Full article content with detailed information"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Category</label>
                  <select name="category" value={formData.category} onChange={handleInputChange}>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
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
                    placeholder="sustainability, carbon, reporting, compliance"
                  />
                </div>
              </div>

              <div className="modal-actions">
                <button type="button" onClick={closeModal} className="btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  {editingKnowledge ? 'Update Article' : 'Create Article'}
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
            <p>Are you sure you want to delete this knowledge article? This action cannot be undone.</p>
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
