import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Header } from "./Header";
import { Body } from "./Dashboard";
import { News } from "./News";
import useNewsStore from "../stores/newsStore";
import { NewsDetailSkeleton } from "./common/Skeleton";

export default function NewsDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { currentArticle, news, fetchNewsArticle, fetchNews, isLoading } = useNewsStore();
  const [relatedArticles, setRelatedArticles] = useState([]);

  useEffect(() => {
    if (slug) {
      fetchNewsArticle(slug);
      fetchNews({ limit: 6 }); // Fetch for related articles
    }
  }, [slug, fetchNewsArticle, fetchNews]);

  useEffect(() => {
    // Get related articles (same category, excluding current)
    if (currentArticle && news.length > 0) {
      const related = news
        .filter(
          (article) =>
            article._id !== currentArticle._id &&
            article.category === currentArticle.category
        )
        .slice(0, 3);
      setRelatedArticles(related);
    }
  }, [currentArticle, news]);

  if (isLoading) {
    return (
      <div className="news-detail-page">
        <Header defaultTab="newsstand" />
        <Body className="news-detail-body">
          <NewsDetailSkeleton />
        </Body>
      </div>
    );
  }

  if (!currentArticle) {
    return (
      <div className="news-detail-page">
        <Header defaultTab="newsstand" />
        <Body className="news-detail-body">
          <div className="news-detail-error">
            <div className="error-content">
              <span className="error-icon">📰</span>
              <h2>Article Not Found</h2>
              <p>The article you're looking for doesn't exist or has been removed.</p>
              <button className="back-to-news-btn" onClick={() => navigate("/news")}>
                ← Back to News
              </button>
            </div>
          </div>
        </Body>
      </div>
    );
  }

  const formattedDate = currentArticle.publishedAt
    ? new Date(currentArticle.publishedAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });

  return (
    <div className="news-detail-page">
      <Header defaultTab="newsstand" />
      <Body className="news-detail-body">
        {/* Back Button */}
        <button className="back-button" onClick={() => navigate("/news")}>
          <span className="back-arrow">←</span>
          <span>Back to News</span>
        </button>

        {/* Article Content */}
        <article className="news-detail-article">
          {/* Category Badge */}
          <div className="article-meta-top">
            <span className="article-category-badge">
              {currentArticle.category || "Sustainability"}
            </span>
            <span className="article-date">{formattedDate}</span>
          </div>

          {/* Title */}
          <h1 className="article-title">{currentArticle.title}</h1>

          {/* Summary */}
          {currentArticle.summary && (
            <p className="article-summary">{currentArticle.summary}</p>
          )}

          {/* Author & Reading Time */}
          <div className="article-meta-bottom">
            <div className="article-author">
              <span className="author-icon">✍️</span>
              <span className="author-name">
                {typeof currentArticle.author === 'object'
                  ? currentArticle.author?.fullName || currentArticle.author?.firstName || "Solidify Team"
                  : currentArticle.author || "Solidify Team"}
              </span>
            </div>
            <div className="article-reading-time">
              <span className="time-icon">⏱</span>
              <span>{getReadTime(currentArticle.content)} min read</span>
            </div>
          </div>

          {/* Featured Image */}
          {currentArticle.imageUrl && (
            <div className="article-image-container">
              <img
                src={currentArticle.imageUrl}
                alt={currentArticle.title}
                className="article-image"
                onError={(e) => {
                  e.target.src =
                    "https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=1200&h=600&fit=crop";
                }}
              />
            </div>
          )}

          {/* Article Content */}
          <div className="article-content">
            {currentArticle.content
              .split("\n\n")
              .map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
          </div>

          {/* Tags */}
          {currentArticle.tags && currentArticle.tags.length > 0 && (
            <div className="article-tags">
              <span className="tags-label">Tags:</span>
              {currentArticle.tags.map((tag, index) => (
                <span key={index} className="article-tag">
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Share Section */}
          <div className="article-share">
            <p className="share-label">Share this article:</p>
            <div className="share-buttons">
              <button className="share-btn twitter" aria-label="Share on Twitter">
                🐦 Twitter
              </button>
              <button className="share-btn linkedin" aria-label="Share on LinkedIn">
                💼 LinkedIn
              </button>
              <button className="share-btn facebook" aria-label="Share on Facebook">
                📘 Facebook
              </button>
              <button
                className="share-btn copy"
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  alert("Link copied to clipboard!");
                }}
                aria-label="Copy link"
              >
                🔗 Copy Link
              </button>
            </div>
          </div>
        </article>

        {/* Related Articles */}
        {relatedArticles.length > 0 && (
          <section className="related-articles-section">
            <h2 className="related-articles-title">Related Articles</h2>
            <div className="related-articles-grid">
              {relatedArticles.map((article) => (
                <div
                  key={article._id}
                  onClick={() => navigate(`/news/${article.slug || article._id}`)}
                  style={{ cursor: "pointer" }}
                >
                  <News
                    news={{
                      image:
                        article.imageUrl ||
                        "https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=600&h=400&fit=crop",
                      content: article.summary || article.content,
                      title: article.title,
                      category: article.category || "Sustainability",
                    }}
                  />
                </div>
              ))}
            </div>
          </section>
        )}
      </Body>
    </div>
  );
}

// Helper function to calculate reading time
function getReadTime(text) {
  if (!text) return 1;
  const wordsPerMinute = 200;
  const wordCount = text.trim().split(/\s+/).length;
  const readTime = Math.ceil(wordCount / wordsPerMinute);
  return readTime || 1;
}
