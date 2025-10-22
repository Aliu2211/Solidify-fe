import { useEffect, useState, useRef, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { Body } from "./Dashboard";
import { Header } from "./Header";
import { Contents } from "./Contents";
import useKnowledgeStore from "../stores/knowledgeStore";
import { NewsGridSkeleton } from "./common/Skeleton";

export default function Sustainability() {
  const { articles, fetchArticles, searchArticles, isLoading } = useKnowledgeStore();
  const [levels, setLevels] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const debounceTimer = useRef(null);
  const location = useLocation();

  useEffect(() => {
    // Fetch all knowledge articles
    fetchArticles({ limit: 50 });
  }, [fetchArticles]);

  // Handle hash navigation (from search results)
  useEffect(() => {
    if (location.hash) {
      const slug = location.hash.substring(1); // Remove the #
      setTimeout(() => {
        const element = document.getElementById(slug);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "center" });
          element.classList.add("highlight-article");
          setTimeout(() => element.classList.remove("highlight-article"), 2000);
        }
      }, 300); // Wait for content to render
    }
  }, [location.hash, articles]);

  // Backend search with debouncing
  const performSearch = useCallback(async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    try {
      const results = await searchArticles(query, { limit: 50 });
      setSearchResults(results || []);
    } catch (error) {
      console.error("Search error:", error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }, [searchArticles]);

  // Debounce search input
  useEffect(() => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    if (searchQuery.trim()) {
      debounceTimer.current = setTimeout(() => {
        performSearch(searchQuery);
      }, 300);
    } else {
      setSearchResults([]);
      setIsSearching(false);
    }

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [searchQuery, performSearch]);

  useEffect(() => {
    // Use search results if searching, otherwise use all articles
    const articlesToGroup = searchQuery.trim() && searchResults.length > 0
      ? searchResults
      : articles;

    // Group articles by sustainability level
    if (articlesToGroup && articlesToGroup.length > 0) {
      const levelData = [
        {
          id: 1,
          title: "Foundation & Measurement",
          level: "foundation",
          message:
            "Start your sustainability journey with essential knowledge and measurement tools. Learn the basics of carbon tracking, emission scopes, and foundational practices for SMEs.",
          articles: articlesToGroup.filter((a) => a.sustainabilityLevel === 1 || a.level === "foundation"),
        },
        {
          id: 2,
          title: "Efficiency and Integration",
          level: "efficiency",
          message:
            "Enhance your operations with advanced efficiency strategies. Explore integration techniques, optimization methods, and tools to improve your carbon management.",
          articles: articlesToGroup.filter((a) => a.sustainabilityLevel === 2 || a.level === "efficiency"),
        },
        {
          id: 3,
          title: "Transformation & Net Zero Leadership",
          level: "transformation",
          message:
            "Lead the transformation toward Net Zero. Discover cutting-edge approaches, leadership strategies, and comprehensive solutions for achieving carbon neutrality.",
          articles: articlesToGroup.filter((a) => a.sustainabilityLevel === 3 || a.level === "transformation"),
        },
      ];

      setLevels(levelData);
    }
  }, [articles, searchQuery, searchResults]);

  if (isLoading) {
    return (
      <div className="sustainability-page">
        <Header defaultTab="relax" />
        <Body className="sustainability">
          <PageHeaderSkeleton />
          <NewsGridSkeleton count={6} />
        </Body>
      </div>
    );
  }

  return (
    <div className="sustainability-page">
      <Header defaultTab="relax" />

      <Body className="sustainability">
        {/* Modern Page Header */}
        <PageHeader
          totalArticles={articles.length}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          isSearching={isSearching}
        />

        {/* Knowledge Levels Content */}
        {levels.length > 0 ? (
          <Contents levels={levels} searchQuery={searchQuery} isSearching={isSearching} />
        ) : searchQuery.trim() && !isSearching ? (
          <NoSearchResults searchQuery={searchQuery} />
        ) : (
          <EmptyState />
        )}
      </Body>
    </div>
  );
}

// Modern Page Header Component
function PageHeader({ totalArticles, searchQuery, setSearchQuery, isSearching }) {
  return (
    <div className="knowledge-page-header">
      <div className="knowledge-header-content">
        <div className="knowledge-title-section">
          <h1 className="knowledge-page-title">Sustainability Knowledge Base</h1>
          <p className="knowledge-page-subtitle">
            Your comprehensive guide to achieving Net Zero carbon emissions
          </p>
        </div>

        <div className="knowledge-stats">
          <div className="knowledge-stat-card">
            <span className="stat-icon">📚</span>
            <div>
              <p className="stat-value">{totalArticles}</p>
              <p className="stat-label">Articles</p>
            </div>
          </div>
          <div className="knowledge-stat-card">
            <span className="stat-icon">🎯</span>
            <div>
              <p className="stat-value">3</p>
              <p className="stat-label">Levels</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="knowledge-search-container">
        <div className="knowledge-search-wrapper">
          <span className="search-icon">{isSearching ? "⏳" : "🔍"}</span>
          <input
            type="text"
            placeholder="Search articles by title, content, summary, or tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="knowledge-search-input"
          />
          {searchQuery && !isSearching && (
            <button
              className="search-clear-btn"
              onClick={() => setSearchQuery("")}
              aria-label="Clear search"
            >
              ✕
            </button>
          )}
        </div>
        {isSearching && (
          <p className="search-status-text">Searching...</p>
        )}
      </div>
    </div>
  );
}

// No Search Results Component
function NoSearchResults({ searchQuery }) {
  return (
    <div className="knowledge-empty-state">
      <div className="empty-state-content">
        <span className="empty-state-icon">🔍</span>
        <h3>No Results Found</h3>
        <p>
          No articles found matching "<strong>{searchQuery}</strong>".
          Try different keywords or browse all articles.
        </p>
      </div>
    </div>
  );
}

// Page Header Skeleton
function PageHeaderSkeleton() {
  return (
    <div className="knowledge-page-header" style={{ opacity: 0.6 }}>
      <div className="knowledge-header-content">
        <div className="knowledge-title-section">
          <div
            style={{
              height: "36px",
              width: "400px",
              background: "#e5e7eb",
              borderRadius: "8px",
              marginBottom: "8px",
            }}
          />
          <div
            style={{
              height: "20px",
              width: "500px",
              background: "#e5e7eb",
              borderRadius: "4px",
            }}
          />
        </div>
      </div>
    </div>
  );
}

// Empty State Component
function EmptyState() {
  return (
    <div className="knowledge-empty-state">
      <div className="empty-state-content">
        <span className="empty-state-icon">📚</span>
        <h3>No Knowledge Articles Available</h3>
        <p>
          The knowledge base is currently being updated. Check back soon for
          sustainability insights and resources.
        </p>
      </div>
    </div>
  );
}
