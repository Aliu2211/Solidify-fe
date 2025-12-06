import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Body } from "./Dashboard";
import { Header } from "./Header";
import { Profile } from "./Profile";
import useLibraryStore from "../stores/libraryStore";
import toast from "react-hot-toast";
import "../styles/LibraryDetail.css";

export default function LibraryDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { fetchResourceById, currentResource, isLoading } = useLibraryStore();

  useEffect(() => {
    const loadResource = async () => {
      if (!id) return;
      const resource = await fetchResourceById(id);
      if (!resource) {
        toast.error("Resource not found");
        navigate("/library");
      }
    };
    loadResource();
  }, [id, fetchResourceById, navigate]);

  if (isLoading) {
    return (
      <div className="library-detail-page">
        <Header><Profile /></Header>
        <Body>
          <div className="library-loading-container">
            <div className="spinner"></div>
            <p>Loading resource...</p>
          </div>
        </Body>
      </div>
    );
  }

  if (!currentResource) return null;

  const { title, description, content, type, url, thumbnail, author, createdAt, tags, category } = currentResource;

  return (
    <div className="library-detail-page">
      <Header><Profile /></Header>
      <Body>
        <div className="library-detail-container">
          <button className="back-nav-btn" onClick={() => navigate("/library")}>
            <span className="material-symbols-outlined">arrow_back</span>
            Back to Library
          </button>

          <div className="resource-content-wrapper">
            <div className="resource-main-content">
              <div className="resource-header-section">
                <div className={`resource-type-badge type-${type}`}>{type}</div>
                <h1 className="resource-detail-title">{title}</h1>
                <div className="resource-meta-row">
                  {category && (
                    <span className="meta-item">
                      <span className="material-symbols-outlined">folder</span> 
                      {typeof category === 'object' ? category.name : category}
                    </span>
                  )}
                  {createdAt && (
                    <span className="meta-item">
                      <span className="material-symbols-outlined">calendar_today</span> 
                      {new Date(createdAt).toLocaleDateString()}
                    </span>
                  )}
                  {author && (
                    <span className="meta-item">
                      <span className="material-symbols-outlined">person</span> 
                      {author}
                    </span>
                  )}
                </div>
              </div>

              {thumbnail && (
                <div className="resource-hero-image">
                  <img src={thumbnail} alt={title} />
                </div>
              )}

              <div className="resource-body">
                <p className="resource-description-large">{description}</p>
                {content && (
                  <div className="resource-full-content" dangerouslySetInnerHTML={{ __html: content }} />
                )}
              </div>

              {tags && tags.length > 0 && (
                <div className="resource-tags-section">
                  <h3>Tags</h3>
                  <div className="tags-list">
                    {tags.map((tag, index) => (
                      <span key={index} className="tag-chip">{tag}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="resource-sidebar">
              <div className="action-card">
                <h3>Actions</h3>
                {url && (
                  <a href={url} target="_blank" rel="noopener noreferrer" className="action-btn primary">
                    <span className="material-symbols-outlined">open_in_new</span>
                    Open Resource
                  </a>
                )}
                <button className="action-btn secondary" onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    toast.success("Link copied to clipboard");
                }}>
                  <span className="material-symbols-outlined">share</span>
                  Share Resource
                </button>
              </div>
            </div>
          </div>
        </div>
      </Body>
    </div>
  );
}
