import { useState, useEffect } from 'react';
import useAdminStore from '../../stores/adminStore';
import LoadingSpinner from '../common/LoadingSpinner';
import toast from 'react-hot-toast';

/**
 * NewsManager Component
 * Full CRUD management for news articles
 */
export default function NewsManager() {
  const { news, newsLoading, fetchNews, createNews, updateNews, deleteNews } =
    useAdminStore();

  const [showModal, setShowModal] = useState(false);
  const [editingNews, setEditingNews] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    category: 'Sustainability',
    author: '',
    imageUrl: '',
    tags: [],
    status: 'draft',
  });

  useEffect(() => {
    // Stagger API calls to prevent rate limiting (4 seconds delay for third manager)
    const timer = setTimeout(() => {
      fetchNews();
    }, 4000);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount

  const categories = ['Sustainability', 'Carbon Offsetting', 'Climate Change', 'Green Technology', 'Policy', 'Research'];
  const statuses = ['draft', 'published', 'archived'];

  const openCreateModal = () => {
    setEditingNews(null);
    setFormData({
      title: '',
      content: '',
      excerpt: '',
      category: 'Sustainability',
      author: '',
      imageUrl: '',
      tags: [],
      status: 'draft',
    });
    setShowModal(true);
  };

  const openEditModal = (article) => {
    setEditingNews(article);
    setFormData({
      title: article.title || '',
      content: article.content || '',
      excerpt: article.excerpt || '',
      category: article.category || 'Sustainability',
      author: typeof article.author === 'string' ? article.author : (article.author?.fullName || article.author?.firstName || ''),
      imageUrl: article.imageUrl || '',
      tags: article.tags || [],
      status: article.status || 'draft',
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingNews(null);
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

    if (!formData.title || !formData.content || !formData.excerpt) {
      toast.error('Please fill in all required fields');
      return;
    }

    const newsData = { ...formData };

    const result = editingNews
      ? await updateNews(editingNews._id, newsData)
      : await createNews(newsData);

    if (result.success) {
      closeModal();
    }
  };

  const handleDelete = async (id) => {
    const result = await deleteNews(id);
    if (result.success) {
      setShowDeleteConfirm(null);
    }
  };

  const filteredNews = news.filter((article) => {
    const matchesSearch =
      article.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.content?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.excerpt?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || article.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  if (newsLoading && news.length === 0) {
    return (
      <div className="admin-loading">
        <LoadingSpinner />
        <p>Loading news articles...</p>
      </div>
    );
  }

  return (
    <div className="admin-manager">
      <div className="manager-header">
        <div className="manager-title">
          <h2>News Management</h2>
          <p>Publish and manage sustainability news</p>
        </div>
        <button className="btn-primary" onClick={openCreateModal}>
          <span className="material-symbols-outlined">add</span>
          Publish News
        </button>
      </div>

      {/* Filters */}
      <div className="manager-filters">
        <div className="filter-search">
          <span className="material-symbols-outlined">search</span>
          <input
            type="text"
            placeholder="Search news articles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="filter-buttons">
          <button
            className={filterStatus === 'all' ? 'active' : ''}
            onClick={() => setFilterStatus('all')}
          >
            All
          </button>
          {statuses.map((status) => (
            <button
              key={status}
              className={filterStatus === status ? 'active' : ''}
              onClick={() => setFilterStatus(status)}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* News Grid */}
      {filteredNews.length === 0 ? (
        <div className="manager-empty">
          <span className="material-symbols-outlined">newspaper</span>
          <h3>No news articles found</h3>
          <p>Publish your first article to get started</p>
        </div>
      ) : (
        <div className="manager-grid">
          {filteredNews.map((article) => (
            <div key={article._id} className="manager-card">
              <div className="card-header">
                <div className="card-category">{article.category}</div>
                <div className="card-actions">
                  <button onClick={() => openEditModal(article)} title="Edit">
                    <span className="material-symbols-outlined">edit</span>
                  </button>
                  <button onClick={() => setShowDeleteConfirm(article._id)} title="Delete">
                    <span className="material-symbols-outlined">delete</span>
                  </button>
                </div>
              </div>
              {article.imageUrl && (
                <div className="card-image">
                  <img src={article.imageUrl} alt={article.title} />
                </div>
              )}
              <h3>{article.title}</h3>
              <p>{article.excerpt}</p>
              <div className="card-meta">
                <span className={`status-badge status-${article.status}`}>
                  {article.status}
                </span>
                {article.author && (
                  <span className="author-badge">
                    <span className="material-symbols-outlined">person</span>
                    {typeof article.author === 'string' ? article.author : article.author.fullName || article.author.firstName}
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
              <h3>{editingNews ? 'Edit News Article' : 'Publish New Article'}</h3>
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
                    Excerpt <span className="required">*</span>
                  </label>
                  <textarea
                    name="excerpt"
                    value={formData.excerpt}
                    onChange={handleInputChange}
                    rows="2"
                    required
                    placeholder="Brief summary of the article"
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
                    rows="8"
                    required
                    placeholder="Full article content"
                  />
                </div>
              </div>

              <div className="form-row-2">
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

                <div className="form-group">
                  <label>Status</label>
                  <select name="status" value={formData.status} onChange={handleInputChange}>
                    {statuses.map((status) => (
                      <option key={status} value={status}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label>Author</label>
                  <input
                    type="text"
                    name="author"
                    value={formData.author}
                    onChange={handleInputChange}
                    placeholder="Article author name"
                  />
                </div>

                <div className="form-group">
                  <label>Image URL</label>
                  <input
                    type="url"
                    name="imageUrl"
                    value={formData.imageUrl}
                    onChange={handleInputChange}
                    placeholder="https://..."
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Tags (comma-separated)</label>
                  <input
                    type="text"
                    value={formData.tags.join(', ')}
                    onChange={handleTagsChange}
                    placeholder="climate, carbon, sustainability"
                  />
                </div>
              </div>

              <div className="modal-actions">
                <button type="button" onClick={closeModal} className="btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  {editingNews ? 'Update Article' : 'Publish Article'}
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
            <p>Are you sure you want to delete this article? This action cannot be undone.</p>
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
