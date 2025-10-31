import { useEffect, useState } from "react";
import { Body } from "./Dashboard";
import { Header } from "./Header";
import { Profile } from "./Profile";
import useLibraryStore from "../stores/libraryStore";
import { NewsGridSkeleton } from "./common/Skeleton";
import toast from "react-hot-toast";
import "../styles/Library.css";

export default function LibrarySection() {
  const {
    resources,
    categories,
    savedResources,
    fetchResources,
    fetchCategories,
    fetchMyFavorites,
    isLoading,
  } = useLibraryStore();

  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState("all"); // "all" or "saved"

  useEffect(() => {
    // Fetch all resources and categories
    fetchResources({ limit: 50 });
    fetchCategories();
    fetchMyFavorites();
  }, [fetchResources, fetchCategories, fetchMyFavorites]);

  // Filter resources
  const filteredResources = (viewMode === "saved" ? savedResources : resources).filter((resource) => {
    const matchesCategory = selectedCategory === "all" || resource.category === selectedCategory;
    const matchesType = selectedType === "all" || resource.type === selectedType;
    const matchesSearch =
      searchQuery.trim() === "" ||
      resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.tags?.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCategory && matchesType && matchesSearch;
  });

  return (
    <div className="library">
      <Header>
        <Profile />
      </Header>

      <Body>
        {/* Page Header */}
        <PageHeader
          totalResources={resources.length}
          savedCount={savedResources.length}
          categories={categories}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          selectedType={selectedType}
          setSelectedType={setSelectedType}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          viewMode={viewMode}
          setViewMode={setViewMode}
        />

        {/* Resources Grid */}
        {isLoading ? (
          <NewsGridSkeleton count={6} />
        ) : filteredResources.length > 0 ? (
          <ResourcesGrid resources={filteredResources} savedResourceIds={savedResources.map(r => r._id)} />
        ) : (
          <EmptyState searchQuery={searchQuery} viewMode={viewMode} />
        )}
      </Body>
    </div>
  );
}

// Page Header Component
function PageHeader({
  totalResources,
  savedCount,
  categories,
  selectedCategory,
  setSelectedCategory,
  selectedType,
  setSelectedType,
  searchQuery,
  setSearchQuery,
  viewMode,
  setViewMode,
}) {
  const resourceTypes = ["article", "video", "pdf", "tool", "case-study"];

  return (
    <div className="library-page-header">
      <div className="library-header-content">
        <div className="library-title-section">
          <h1 className="library-page-title">Resource Library</h1>
          <p className="library-page-subtitle">
            Access curated sustainability resources, tools, and case studies
          </p>
        </div>

        <div className="library-stats">
          <div className="library-stat-card">
            <span className="stat-icon">📚</span>
            <div>
              <p className="stat-value">{totalResources}</p>
              <p className="stat-label">Resources</p>
            </div>
          </div>
          <div className="library-stat-card">
            <span className="stat-icon">⭐</span>
            <div>
              <p className="stat-value">{savedCount}</p>
              <p className="stat-label">Favorites</p>
            </div>
          </div>
          <div className="library-stat-card">
            <span className="stat-icon">🏷️</span>
            <div>
              <p className="stat-value">{categories.length}</p>
              <p className="stat-label">Categories</p>
            </div>
          </div>
        </div>
      </div>

      {/* View Mode Toggle */}
      <div className="view-mode-toggle">
        <button
          className={`view-mode-btn ${viewMode === "all" ? "active" : ""}`}
          onClick={() => setViewMode("all")}
        >
          <span className="material-symbols-outlined">grid_view</span>
          All Resources
        </button>
        <button
          className={`view-mode-btn ${viewMode === "saved" ? "active" : ""}`}
          onClick={() => setViewMode("saved")}
        >
          <span className="material-symbols-outlined">favorite</span>
          My Favorites
        </button>
      </div>

      {/* Search Bar */}
      <div className="library-search-container">
        <div className="library-search-wrapper">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search resources by title, description, or tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="library-search-input"
          />
          {searchQuery && (
            <button
              className="search-clear-btn"
              onClick={() => setSearchQuery("")}
              aria-label="Clear search"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="library-filters">
        {/* Category Filter */}
        <div className="filter-group">
          <label className="filter-label">Category</label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Categories</option>
            {categories.map((category) => {
              // Handle both string and object formats
              const categoryValue = typeof category === 'string' ? category : category._id;
              const categoryLabel = typeof category === 'string' ? category : category._id;
              return (
                <option key={categoryValue} value={categoryValue}>
                  {categoryLabel}
                </option>
              );
            })}
          </select>
        </div>

        {/* Type Filter */}
        <div className="filter-group">
          <label className="filter-label">Resource Type</label>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Types</option>
            {resourceTypes.map((type) => (
              <option key={type} value={type}>
                {type.charAt(0).toUpperCase() + type.slice(1).replace("-", " ")}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}

// Resources Grid Component
function ResourcesGrid({ resources, savedResourceIds }) {
  return (
    <div className="resources-container">
      <div className="resources-grid">
        {resources.map((resource) => (
          <ResourceCard
            key={resource._id}
            resource={resource}
            isSaved={savedResourceIds.includes(resource._id)}
          />
        ))}
      </div>
    </div>
  );
}

// Resource Card Component
function ResourceCard({ resource, isSaved }) {
  const { favoriteResource, unfavoriteResource, downloadResource, fetchResourceById } = useLibraryStore();
  const [isBookmarked, setIsBookmarked] = useState(isSaved);
  const [isHovered, setIsHovered] = useState(false);
  const [isBookmarking, setIsBookmarking] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isViewing, setIsViewing] = useState(false);

  const handleView = async () => {
    setIsViewing(true);
    try {
      // Fetch full resource details by ID (increments view count)
      const fullResource = await fetchResourceById(resource._id);

      if (fullResource && fullResource.url) {
        // Open resource URL in new tab
        window.open(fullResource.url, "_blank", "noopener,noreferrer");
      } else {
        toast.error("No URL available for this resource");
      }
    } catch (error) {
      toast.error("Failed to load resource details");
    } finally {
      setIsViewing(false);
    }
  };

  const handleBookmark = async (e) => {
    e.stopPropagation();
    if (isBookmarking) return;

    setIsBookmarking(true);
    try {
      if (isBookmarked) {
        const response = await unfavoriteResource(resource._id);
        if (response.success) {
          setIsBookmarked(false);
          toast.success("📌 Resource removed from favorites");
        } else {
          toast.error(response.message || "Failed to remove from favorites");
        }
      } else {
        const response = await favoriteResource(resource._id);
        if (response.success) {
          setIsBookmarked(true);
          toast.success("⭐ Resource added to favorites");
        } else {
          toast.error(response.message || "Failed to add to favorites");
        }
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setIsBookmarking(false);
    }
  };

  const handleDownload = async (e) => {
    e.stopPropagation();
    if (isDownloading) return;

    if (resource.type === "pdf" && resource.downloadUrl) {
      setIsDownloading(true);
      try {
        const response = await downloadResource(resource._id);
        if (response.success) {
          toast.success("📥 Download started");
        } else {
          toast.error(response.message || "Download failed");
        }
      } catch (error) {
        toast.error("Download failed");
      } finally {
        setIsDownloading(false);
      }
    } else {
      toast.error("Download not available for this resource");
    }
  };

  const getTypeIcon = () => {
    const icons = {
      article: "article",
      video: "play_circle",
      pdf: "picture_as_pdf",
      tool: "build",
      "case-study": "assignment",
    };
    return icons[resource.type] || "description";
  };

  const getTypeColor = () => {
    const colors = {
      article: "#22c55e",      // Green (primary)
      video: "#16a34a",        // Dark green
      pdf: "#15803d",          // Darker green
      tool: "#14532d",         // Very dark green
      "case-study": "#10b981", // Emerald
    };
    return colors[resource.type] || "#22c55e";
  };

  return (
    <div
      className={`resource-card ${isHovered ? "hovered" : ""}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ "--type-color": getTypeColor() }}
    >
      {/* Bookmark Button */}
      <button
        className={`bookmark-btn ${isBookmarked ? "bookmarked" : ""} ${isBookmarking ? "loading" : ""}`}
        onClick={handleBookmark}
        disabled={isBookmarking}
        aria-label={isBookmarked ? "Remove bookmark" : "Bookmark"}
      >
        <span className="material-symbols-outlined">
          {isBookmarking ? "hourglass_empty" : isBookmarked ? "bookmark" : "bookmark_border"}
        </span>
      </button>

      {/* Type Badge */}
      <div className="resource-type-badge" style={{ background: getTypeColor() }}>
        <span className="material-symbols-outlined">{getTypeIcon()}</span>
        <span className="type-label">{resource.type ? resource.type.replace("-", " ") : "resource"}</span>
      </div>

      {/* Thumbnail */}
      <div className="resource-thumbnail" onClick={handleView}>
        {resource.thumbnail ? (
          <img src={resource.thumbnail} alt={resource.title} className="resource-thumbnail-img" />
        ) : (
          <div className="resource-thumbnail-placeholder" style={{
            background: `linear-gradient(135deg, ${getTypeColor()}15 0%, ${getTypeColor()}30 100%)`
          }}>
            <span className="material-symbols-outlined" style={{ color: getTypeColor() }}>
              {getTypeIcon()}
            </span>
          </div>
        )}
        {/* Hover overlay */}
        {isHovered && (
          <div className="thumbnail-hover-overlay">
            <span className="material-symbols-outlined">visibility</span>
            <span>View Resource</span>
          </div>
        )}
      </div>

      {/* Card Body */}
      <div className="resource-card-body">
        <div className="resource-header">
          <h3 className="resource-title">{resource.title}</h3>
        </div>
        <p className="resource-description">{resource.description || "No description available"}</p>

        {/* Tags */}
        {resource.tags && resource.tags.length > 0 && (
          <div className="resource-tags">
            {resource.tags.slice(0, 3).map((tag, idx) => (
              <span key={idx} className="resource-tag">
                <span className="material-symbols-outlined tag-icon">tag</span>
                {tag}
              </span>
            ))}
            {resource.tags.length > 3 && (
              <span className="resource-tag more">
                <span className="material-symbols-outlined">more_horiz</span>
                +{resource.tags.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Meta Info */}
        <div className="resource-meta">
          <div className="resource-meta-item">
            <span className="material-symbols-outlined">visibility</span>
            <span>{resource.views || 0}</span>
          </div>
          {resource.category && (
            <div className="resource-meta-item category">
              <span className="material-symbols-outlined">folder</span>
              <span>{resource.category}</span>
            </div>
          )}
        </div>
      </div>

      {/* Card Footer */}
      <div className="resource-card-footer">
        <button
          className={`resource-action-btn view-btn ${isViewing ? "loading" : ""}`}
          onClick={handleView}
          disabled={isViewing}
          style={{ background: getTypeColor() }}
        >
          <span className="btn-text">{isViewing ? "Loading..." : "View Resource"}</span>
          <span className="material-symbols-outlined btn-icon">
            {isViewing ? "hourglass_empty" : "open_in_new"}
          </span>
        </button>
        {resource.type === "pdf" && resource.downloadUrl && (
          <button
            className={`resource-download-btn ${isDownloading ? "loading" : ""}`}
            onClick={handleDownload}
            disabled={isDownloading}
            style={{ borderColor: getTypeColor(), color: getTypeColor() }}
          >
            <span className="material-symbols-outlined">
              {isDownloading ? "downloading" : "download"}
            </span>
          </button>
        )}
      </div>
    </div>
  );
}

// Empty State Component
function EmptyState({ searchQuery, viewMode }) {
  return (
    <div className="library-empty-state">
      <div className="empty-state-content">
        <span className="empty-state-icon">
          {viewMode === "saved" ? "⭐" : "🔍"}
        </span>
        <h3>
          {viewMode === "saved"
            ? "No Favorite Resources"
            : searchQuery
            ? "No Results Found"
            : "No Resources Available"}
        </h3>
        <p>
          {viewMode === "saved"
            ? "You haven't added any favorites yet. Browse the library and favorite resources you find useful."
            : searchQuery
            ? `No resources found matching "${searchQuery}". Try different keywords or filters.`
            : "The resource library is currently being updated. Check back soon for sustainability resources."}
        </p>
      </div>
    </div>
  );
}
