import { useState, useEffect } from 'react';
import useAdminStore from '../../stores/adminStore';
import LoadingSpinner from '../common/LoadingSpinner';
import toast from 'react-hot-toast';

/**
 * NewsManager Component
 * Full CRUD management for news articles
 */
export default function NewsManager() {
  const { news, newsLoading, fetchNews, createNews } = useAdminStore();

  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    summary: '',
    category: 'policy',
    imageUrl: '',
    tags: [],
    source: '',
    sourceUrl: '',
    featured: false,
  });

  useEffect(() => {
    // Stagger API calls to prevent rate limiting (4 seconds delay for third manager)
    const timer = setTimeout(() => {
      fetchNews();
    }, 4000);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount

  const categories = ['policy', 'technology', 'success-stories', 'events', 'global-trends'];

  const openCreateModal = () => {
    setFormData({
      title: '',
      content: '',
      summary: '',
      category: 'policy',
      imageUrl: '',
      tags: [],
      source: '',
      sourceUrl: '',
      featured: false,
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
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

    if (!formData.title || !formData.content || !formData.summary || !formData.category) {
      toast.error('Please fill in all required fields');
      return;
    }

    const newsData = { ...formData };
    const result = await createNews(newsData);

    if (result.success) {
      closeModal();
    }
  };

  const filteredNews = news.filter((article) => {
    const matchesSearch =
      article.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.content?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.summary?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || article.category === filterStatus;
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

        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
          <option value="all">All Categories</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
            </option>
          ))}
        </select>
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
                <div className="card-category">{article.category.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}</div>
              </div>
              {article.imageUrl && (
                <div className="card-image">
                  <img src={article.imageUrl} alt={article.title} />
                </div>
              )}
              <h3>{article.title}</h3>
              <p>{article.summary}</p>
              <div className="card-meta">
                <span className={`status-badge ${article.featured ? 'status-published' : 'status-draft'}`}>
                  {article.featured ? 'Featured' : 'Standard'}
                </span>
                {article.source && (
                  <span className="author-badge">
                    <span className="material-symbols-outlined">link</span>
                    {article.source}
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
              <h3>
                <span className="material-symbols-outlined">article</span>
                Publish New Article
              </h3>
              <button type="button" onClick={closeModal}>
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-section-title">
                <span className="material-symbols-outlined">description</span>
                Article Details
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
                    placeholder="Enter article title"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>
                    Summary <span className="required">*</span>
                  </label>
                  <textarea
                    name="summary"
                    value={formData.summary}
                    onChange={handleInputChange}
                    rows="2"
                    required
                    placeholder="Brief summary of the article (max 500 characters)"
                    maxLength={500}
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

              <div className="form-section-title">
                <span className="material-symbols-outlined">settings</span>
                Publishing Settings
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
                  <label>Featured Article</label>
                  <select
                    name="featured"
                    value={formData.featured.toString()}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.value === 'true' })}
                  >
                    <option value="false">No</option>
                    <option value="true">Yes</option>
                  </select>
                </div>
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label>Source</label>
                  <input
                    type="text"
                    name="source"
                    value={formData.source}
                    onChange={handleInputChange}
                    placeholder="e.g., Ghana Ministry of Environment"
                  />
                </div>

                <div className="form-group">
                  <label>Source URL</label>
                  <input
                    type="url"
                    name="sourceUrl"
                    value={formData.sourceUrl}
                    onChange={handleInputChange}
                    placeholder="https://..."
                  />
                </div>
              </div>

              <div className="form-row">
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
            </form>

            <div className="modal-actions">
              <button type="button" onClick={closeModal}>
                <span className="material-symbols-outlined">close</span>
                Cancel
              </button>
              <button type="submit" onClick={handleSubmit}>
                <span className="material-symbols-outlined">publish</span>
                Publish Article
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
