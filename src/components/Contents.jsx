import { useState } from "react";

export function Contents({ levels, searchQuery, isSearching }) {
  const [selectedLevel, setSelectedLevel] = useState(levels[0]); // Auto-select first level

  function handleSelection(level) {
    setSelectedLevel(level);
  }

  const totalArticles = levels.reduce(
    (sum, level) => sum + level.articles.length,
    0
  );

  return (
    <div className="knowledge-contents">
      {/* Level Selector */}
      <LevelSelector
        levels={levels}
        selectedLevel={selectedLevel}
        onSelection={handleSelection}
      />

      {/* Results Info */}
      {searchQuery && !isSearching && (
        <div className="search-results-info">
          <p>
            Found <strong>{totalArticles}</strong> article
            {totalArticles !== 1 ? "s" : ""} matching "
            <strong>{searchQuery}</strong>"
          </p>
        </div>
      )}

      {/* Selected Level Content */}
      {selectedLevel && (
        <LevelContent selectedLevel={selectedLevel} searchQuery={searchQuery} />
      )}
    </div>
  );
}

// Level Selector Component
function LevelSelector({ levels, selectedLevel, onSelection }) {
  const levelIcons = {
    foundation: "🌱",
    efficiency: "⚡",
    transformation: "🚀",
  };

  const levelColors = {
    foundation: "#10b981",
    efficiency: "#3b82f6",
    transformation: "#8b5cf6",
  };

  return (
    <div className="level-selector-container">
      <h2 className="level-selector-title">Learning Path</h2>
      <div className="level-selector-grid">
        {levels.map((level, index) => (
          <button
            key={level.id}
            className={`level-card ${
              selectedLevel?.id === level.id ? "active" : ""
            }`}
            onClick={() => onSelection(level)}
            style={{
              borderColor:
                selectedLevel?.id === level.id
                  ? levelColors[level.level]
                  : "transparent",
            }}
          >
            <div className="level-card-header">
              <span className="level-icon">
                {levelIcons[level.level] || "📖"}
              </span>
              <span className="level-number">Level {index + 1}</span>
            </div>
            <h3 className="level-card-title">{level.title}</h3>
            <div className="level-card-footer">
              <span className="article-count">
                {level.articles?.length || 0} article
                {level.articles?.length !== 1 ? "s" : ""}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

// Level Content Component
function LevelContent({ selectedLevel, searchQuery }) {
  return (
    <div className="level-content-section">
      <div className="level-content-header">
        <h2 className="level-content-title">{selectedLevel.title}</h2>
        <p className="level-content-description">{selectedLevel.message}</p>
      </div>

      {selectedLevel.articles && selectedLevel.articles.length > 0 ? (
        <div className="articles-grid">
          {selectedLevel.articles.map((article) => (
            <ArticleCard
              key={article._id}
              article={article}
              searchQuery={searchQuery}
            />
          ))}
        </div>
      ) : (
        <div className="no-articles-message">
          <p>
            {searchQuery
              ? "No articles match your search in this level."
              : "No articles available for this level yet."}
          </p>
        </div>
      )}
    </div>
  );
}

// Modern Article Card Component
function ArticleCard({ article, searchQuery }) {
  // Each article has its own independent expanded state
  const [isExpanded, setIsExpanded] = useState(false);

  const handleToggle = (e) => {
    e.stopPropagation(); // Prevent event bubbling
    setIsExpanded(!isExpanded);
  };

  // Highlight search terms
  const highlightText = (text) => {
    if (!searchQuery || !text) return text;
    const parts = text.split(new RegExp(`(${searchQuery})`, "gi"));
    return parts.map((part, index) =>
      part.toLowerCase() === searchQuery.toLowerCase() ? (
        <mark key={index} className="search-highlight">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  return (
    <article className="knowledge-article-card" id={article.slug || article._id}>
      {/* Article Header */}
      <div
        className="article-card-header"
        onClick={handleToggle}
      >
        <div className="article-card-title-section">
          <span className="article-icon">📄</span>
          <h3 className="article-card-title">{highlightText(article.title)}</h3>
        </div>
        <button className="expand-btn" aria-label={isExpanded ? "Collapse" : "Expand"}>
          {isExpanded ? "−" : "+"}
        </button>
      </div>

      {/* Expandable Content */}
      {isExpanded && (
        <div className="article-card-content">
          {/* Summary */}
          <div className="article-summary-section">
            <h4 className="content-section-title">Summary</h4>
            <p className="article-summary">
              {highlightText(article.summary || "No summary available")}
            </p>
          </div>

          {/* Full Content from Backend */}
          {article.content ? (
            <div className="article-full-content">
              <h4 className="content-section-title">Content</h4>
              <div className="article-content-body">
                {highlightText(article.content)}
              </div>
            </div>
          ) : (
            <div className="no-content-message">
              <p>No detailed content available for this article.</p>
            </div>
          )}

          {/* Metadata Section */}
          <div className="article-metadata">
            {/* Category */}
            {article.category && (
              <div className="article-meta">
                <span className="meta-label">Category:</span>
                <span className="meta-value">{article.category}</span>
              </div>
            )}

            {/* Author */}
            {article.author && (
              <div className="article-meta">
                <span className="meta-label">Author:</span>
                <span className="meta-value">
                  {typeof article.author === 'object'
                    ? article.author.fullName || article.author.firstName
                    : article.author}
                </span>
              </div>
            )}

            {/* Last Updated */}
            {article.updatedAt && (
              <div className="article-meta">
                <span className="meta-label">Last Updated:</span>
                <span className="meta-value">
                  {new Date(article.updatedAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </div>
            )}
          </div>

          {/* Tags */}
          {article.tags?.length > 0 && (
            <div className="article-tags-section">
              <span className="tags-title">Tags:</span>
              <div className="article-tags-list">
                {article.tags.map((tag, idx) => (
                  <span key={idx} className="article-tag">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </article>
  );
}
