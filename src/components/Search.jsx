import { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import useKnowledgeStore from "../stores/knowledgeStore";
import useNewsStore from "../stores/newsStore";

export function Search() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [searchResults, setSearchResults] = useState({ knowledge: [], news: [] });
  const [isSearching, setIsSearching] = useState(false);
  const searchRef = useRef(null);
  const inputRef = useRef(null);
  const debounceTimer = useRef(null);
  const navigate = useNavigate();

  const { searchArticles: searchKnowledge } = useKnowledgeStore();
  const { news: newsArticles } = useNewsStore();

  // Debounced search function
  const performSearch = useCallback(async (query) => {
    if (!query.trim()) {
      setSearchResults({ knowledge: [], news: [] });
      setIsSearching(false);
      return;
    }

    setIsSearching(true);

    try {
      // Search knowledge base using backend API
      const knowledgeResults = await searchKnowledge(query, { limit: 3 });

      // Search news (client-side for now since no backend search endpoint)
      const newsResults = (newsArticles || [])
        .filter(
          (article) =>
            article.title?.toLowerCase().includes(query.toLowerCase()) ||
            article.summary?.toLowerCase().includes(query.toLowerCase()) ||
            article.content?.toLowerCase().includes(query.toLowerCase()) ||
            article.category?.toLowerCase().includes(query.toLowerCase())
        )
        .slice(0, 3);

      setSearchResults({
        knowledge: knowledgeResults || [],
        news: newsResults,
      });
    } catch (error) {
      console.error("Search error:", error);
      setSearchResults({ knowledge: [], news: [] });
    } finally {
      setIsSearching(false);
    }
  }, [searchKnowledge, newsArticles]);

  // Debounce search input
  useEffect(() => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    if (searchQuery.trim()) {
      debounceTimer.current = setTimeout(() => {
        performSearch(searchQuery);
      }, 300); // 300ms debounce
    } else {
      setSearchResults({ knowledge: [], news: [] });
      setIsSearching(false);
    }

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [searchQuery, performSearch]);

  const totalResults = searchResults.knowledge.length + searchResults.news.length;

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
        setActiveIndex(-1);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (!isDropdownOpen || totalResults === 0) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setActiveIndex((prev) => (prev < totalResults - 1 ? prev + 1 : prev));
        break;
      case "ArrowUp":
        e.preventDefault();
        setActiveIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case "Enter":
        e.preventDefault();
        if (activeIndex >= 0) {
          handleResultClick(activeIndex);
        }
        break;
      case "Escape":
        e.preventDefault();
        setIsDropdownOpen(false);
        setActiveIndex(-1);
        inputRef.current?.blur();
        break;
      default:
        break;
    }
  };

  // Handle result click
  const handleResultClick = (index) => {
    let currentIndex = 0;

    // Check knowledge articles
    if (index < searchResults.knowledge.length) {
      const article = searchResults.knowledge[index];
      navigate(`/sustainability#${article.slug || article._id}`);
      resetSearch();
      return;
    }
    currentIndex += searchResults.knowledge.length;

    // Check news articles
    if (index < currentIndex + searchResults.news.length) {
      const article = searchResults.news[index - currentIndex];
      navigate(`/news/${article.slug || article._id}`);
      resetSearch();
      return;
    }
  };

  const resetSearch = () => {
    setSearchQuery("");
    setIsDropdownOpen(false);
    setActiveIndex(-1);
    inputRef.current?.blur();
  };

  const handleInputChange = (e) => {
    setSearchQuery(e.target.value);
    setIsDropdownOpen(e.target.value.trim().length > 0);
    setActiveIndex(-1);
  };

  return (
    <section className="search" ref={searchRef}>
      <span className="search-bar">
        <input
          ref={inputRef}
          type="text"
          placeholder="Search articles, news, and resources..."
          value={searchQuery}
          onChange={handleInputChange}
          onFocus={() => searchQuery.trim() && setIsDropdownOpen(true)}
          onKeyDown={handleKeyDown}
        />
        {isSearching ? (
          <span className="material-symbols-outlined search-loading">progress_activity</span>
        ) : searchQuery ? (
          <span
            className="material-symbols-outlined search-clear"
            onClick={resetSearch}
            title="Clear search"
          >
            close
          </span>
        ) : (
          <span className="material-symbols-outlined">search</span>
        )}
      </span>

      {/* Search Results Dropdown */}
      {isDropdownOpen && searchQuery.trim() && (
        <div className="search-dropdown">
          {totalResults > 0 ? (
            <>
              {/* Knowledge Articles Section */}
              {searchResults.knowledge.length > 0 && (
                <div className="search-section">
                  <div className="search-section-header">
                    <span className="material-symbols-outlined">school</span>
                    <span>Knowledge Base</span>
                  </div>
                  {searchResults.knowledge.map((article, idx) => {
                    const globalIndex = idx;
                    return (
                      <div
                        key={article.id || article._id}
                        className={`search-result-item ${
                          activeIndex === globalIndex ? "active" : ""
                        }`}
                        onClick={() => handleResultClick(globalIndex)}
                        onMouseEnter={() => setActiveIndex(globalIndex)}
                      >
                        <div className="search-result-content">
                          <div className="search-result-title">{article.title}</div>
                          {article.summary && (
                            <div className="search-result-summary">
                              {article.summary.substring(0, 80)}...
                            </div>
                          )}
                          {article.tags && article.tags.length > 0 && (
                            <div className="search-result-tags">
                              {article.tags.slice(0, 2).map((tag, i) => (
                                <span key={i} className="search-tag">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                        <span className="material-symbols-outlined search-arrow">
                          arrow_forward
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* News Articles Section */}
              {searchResults.news.length > 0 && (
                <div className="search-section">
                  <div className="search-section-header">
                    <span className="material-symbols-outlined">newspaper</span>
                    <span>News & Updates</span>
                  </div>
                  {searchResults.news.map((article, idx) => {
                    const globalIndex = searchResults.knowledge.length + idx;
                    return (
                      <div
                        key={article.id || article._id}
                        className={`search-result-item ${
                          activeIndex === globalIndex ? "active" : ""
                        }`}
                        onClick={() => handleResultClick(globalIndex)}
                        onMouseEnter={() => setActiveIndex(globalIndex)}
                      >
                        <div className="search-result-content">
                          <div className="search-result-title">{article.title}</div>
                          {article.summary && (
                            <div className="search-result-summary">
                              {article.summary.substring(0, 80)}...
                            </div>
                          )}
                          {article.category && (
                            <div className="search-result-category">{article.category}</div>
                          )}
                        </div>
                        <span className="material-symbols-outlined search-arrow">
                          arrow_forward
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Footer */}
              <div className="search-dropdown-footer">
                <span className="search-footer-hint">
                  Press <kbd>↑</kbd> <kbd>↓</kbd> to navigate, <kbd>Enter</kbd> to select,{" "}
                  <kbd>Esc</kbd> to close
                </span>
              </div>
            </>
          ) : (
            <div className="search-no-results">
              <span className="material-symbols-outlined">search_off</span>
              <p>No results found for "{searchQuery}"</p>
              <span className="search-hint">Try different keywords or browse our sections</span>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
