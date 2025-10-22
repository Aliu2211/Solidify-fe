import { useEffect, useState } from "react";
import { Body } from "./Dashboard";
import { Header } from "./Header";
import { News } from "./News";
import useNewsStore from "../stores/newsStore";
import { NewsGridSkeleton } from "./common/Skeleton";
import { NEWS_CATEGORIES } from "../utils/constants";

// Reusable Heading Component (for backward compatibility)
export function Heading({ children }) {
  return (
    <div className="section-heading-legacy">
      <span className="section-heading-text">{children}</span>
      <span className="section-heading-bar"></span>
    </div>
  );
}

export default function NewsSection() {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="news-section-page">
      <Header defaultTab="newsstand" />
      <Body className="news">
        <PageHeader />
        <FilterSection
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
        <NewsRows
          selectedCategory={selectedCategory}
          searchQuery={searchQuery}
        />
      </Body>
    </div>
  );
}

// Modern Page Header
function PageHeader() {
  return (
    <div className="news-page-header">
      <div className="news-page-title-section">
        <h1 className="news-page-title">Sustainability News</h1>
        <p className="news-page-subtitle">
          Stay informed with the latest sustainability trends, policies, and success stories
        </p>
      </div>
      <div className="news-stats">
        <div className="news-stat-item">
          <span className="stat-icon">📰</span>
          <div>
            <p className="stat-label">Articles</p>
            <p className="stat-value" id="total-articles">...</p>
          </div>
        </div>
        <div className="news-stat-item">
          <span className="stat-icon">🌍</span>
          <div>
            <p className="stat-label">Categories</p>
            <p className="stat-value">5</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Enhanced Filter Section with Search
function FilterSection({ selectedCategory, setSelectedCategory, searchQuery, setSearchQuery }) {
  const categories = [
    { value: "", label: "All News", icon: "📋" },
    { value: NEWS_CATEGORIES.POLICY, label: "Policy", icon: "⚖️" },
    { value: NEWS_CATEGORIES.TECHNOLOGY, label: "Technology", icon: "💻" },
    { value: NEWS_CATEGORIES.SUCCESS_STORIES, label: "Success Stories", icon: "🏆" },
    { value: NEWS_CATEGORIES.EVENTS, label: "Events", icon: "📅" },
    { value: NEWS_CATEGORIES.GLOBAL_TRENDS, label: "Global Trends", icon: "🌐" },
  ];

  return (
    <div className="news-filter-section">
      {/* Search Bar */}
      <div className="news-search-container">
        <div className="news-search-wrapper">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search news articles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="news-search-input"
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

      {/* Category Pills */}
      <div className="news-category-pills">
        {categories.map((cat) => (
          <button
            key={cat.value}
            className={`category-pill ${selectedCategory === cat.value ? 'active' : ''}`}
            onClick={() => setSelectedCategory(cat.value)}
          >
            <span className="pill-icon">{cat.icon}</span>
            <span className="pill-label">{cat.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function NewsRows({ selectedCategory, searchQuery }) {
  const { news, fetchNews, isLoading, pagination } = useNewsStore();

  useEffect(() => {
    const filters = selectedCategory ? { category: selectedCategory } : {};
    fetchNews(filters);
  }, [fetchNews, selectedCategory]);

  // Update article count in header
  useEffect(() => {
    const countElement = document.getElementById('total-articles');
    if (countElement && pagination.total !== undefined) {
      countElement.textContent = pagination.total;
    }
  }, [pagination.total]);

  // Client-side search filtering
  const filteredNews = news?.filter((article) => {
    if (!searchQuery) return true;
    const searchLower = searchQuery.toLowerCase();
    return (
      article.title?.toLowerCase().includes(searchLower) ||
      article.summary?.toLowerCase().includes(searchLower) ||
      article.content?.toLowerCase().includes(searchLower) ||
      article.category?.toLowerCase().includes(searchLower)
    );
  });

  if (isLoading) {
    return <NewsGridSkeleton count={9} />;
  }

  if (!news || news.length === 0) {
    return (
      <div className="news-empty-state">
        <div className="empty-state-content">
          <span className="empty-state-icon">📰</span>
          <h3>No news articles available</h3>
          <p>Check back later for the latest sustainability updates and insights.</p>
        </div>
      </div>
    );
  }

  if (filteredNews.length === 0 && searchQuery) {
    return (
      <div className="news-empty-state">
        <div className="empty-state-content">
          <span className="empty-state-icon">🔍</span>
          <h3>No results found</h3>
          <p>Try adjusting your search or browse all articles</p>
          <button
            className="reset-search-btn"
            onClick={() => window.location.reload()}
          >
            Clear Filters
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="news-results-header">
        <p className="results-count">
          Showing <strong>{filteredNews.length}</strong> article{filteredNews.length !== 1 ? 's' : ''}
          {selectedCategory && <span> in <strong>{selectedCategory}</strong></span>}
          {searchQuery && <span> matching "<strong>{searchQuery}</strong>"</span>}
        </p>
      </div>

      <div className="news-grid-page">
        {filteredNews.map((article) => (
          <News
            key={article._id}
            news={{
              _id: article._id,
              slug: article.slug,
              image: article.imageUrl || `https://images.unsplash.com/photo-${Math.random() > 0.5 ? '1611273426858-450d8e3c9fce' : '1569163139394-79a1ce873e4e'}?w=800&h=500&fit=crop`,
              content: article.summary || article.content,
              title: article.title,
              category: article.category || "Sustainability",
            }}
          />
        ))}
      </div>
    </>
  );
}
