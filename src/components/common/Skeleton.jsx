/**
 * Skeleton Loading Component
 * Displays animated placeholder while content loads
 */

export function Skeleton({ variant = "text", width, height, className = "" }) {
  const skeletonClass = `skeleton skeleton-${variant} ${className}`;

  const style = {
    width: width || "100%",
    height: height || (variant === "text" ? "1em" : variant === "rect" ? "200px" : "40px"),
  };

  return <div className={skeletonClass} style={style}></div>;
}

// NewsDetail Article Skeleton
export function NewsDetailSkeleton() {
  return (
    <div className="news-detail-skeleton">
      {/* Back Button Skeleton */}
      <Skeleton variant="rect" width="150px" height="44px" className="skeleton-back-btn" />

      {/* Article Skeleton */}
      <div className="news-detail-article skeleton-article">
        {/* Meta Top */}
        <div className="skeleton-meta-top">
          <Skeleton variant="rect" width="120px" height="32px" />
          <Skeleton variant="text" width="150px" height="20px" />
        </div>

        {/* Title */}
        <Skeleton variant="text" width="90%" height="48px" className="skeleton-title" />
        <Skeleton variant="text" width="70%" height="48px" className="skeleton-title" />

        {/* Summary */}
        <div className="skeleton-summary">
          <Skeleton variant="text" width="100%" height="20px" />
          <Skeleton variant="text" width="95%" height="20px" />
          <Skeleton variant="text" width="85%" height="20px" />
        </div>

        {/* Meta Bottom */}
        <div className="skeleton-meta-bottom">
          <Skeleton variant="text" width="150px" height="20px" />
          <Skeleton variant="text" width="100px" height="20px" />
        </div>

        {/* Image */}
        <Skeleton variant="rect" width="100%" height="400px" className="skeleton-image" />

        {/* Content Paragraphs */}
        <div className="skeleton-content">
          <Skeleton variant="text" width="100%" height="18px" />
          <Skeleton variant="text" width="98%" height="18px" />
          <Skeleton variant="text" width="95%" height="18px" />
          <Skeleton variant="text" width="97%" height="18px" />
          <br />
          <Skeleton variant="text" width="100%" height="18px" />
          <Skeleton variant="text" width="92%" height="18px" />
          <Skeleton variant="text" width="96%" height="18px" />
          <br />
          <Skeleton variant="text" width="98%" height="18px" />
          <Skeleton variant="text" width="100%" height="18px" />
          <Skeleton variant="text" width="88%" height="18px" />
        </div>

        {/* Tags */}
        <div className="skeleton-tags">
          <Skeleton variant="rect" width="80px" height="32px" />
          <Skeleton variant="rect" width="100px" height="32px" />
          <Skeleton variant="rect" width="90px" height="32px" />
        </div>
      </div>
    </div>
  );
}

// News Card Skeleton
export function NewsCardSkeleton() {
  return (
    <div className="news-card skeleton-card">
      <Skeleton variant="rect" width="100%" height="220px" className="skeleton-news-image" />
      <div className="news-content">
        <Skeleton variant="text" width="90%" height="24px" className="skeleton-news-title" />
        <Skeleton variant="text" width="70%" height="24px" className="skeleton-news-title" />
        <br />
        <Skeleton variant="text" width="100%" height="16px" />
        <Skeleton variant="text" width="95%" height="16px" />
        <Skeleton variant="text" width="85%" height="16px" />
        <br />
        <div className="skeleton-news-footer">
          <Skeleton variant="rect" width="100px" height="28px" />
          <Skeleton variant="text" width="80px" height="16px" />
        </div>
      </div>
    </div>
  );
}

// News Grid Skeleton
export function NewsGridSkeleton({ count = 6 }) {
  return (
    <div className="news-grid-page">
      {Array.from({ length: count }).map((_, index) => (
        <NewsCardSkeleton key={index} />
      ))}
    </div>
  );
}

// Chat Skeleton
export function ChatSkeleton() {
  return (
    <div className="chat-container">
      {/* Conversations Sidebar Skeleton */}
      <div className="conversations-sidebar">
        <div className="conversations-header">
          <Skeleton variant="text" width="120px" height="32px" />
          <Skeleton variant="rect" width="40px" height="28px" />
        </div>
        <div className="conversations-list">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="conversation-item">
              <Skeleton variant="rect" width="52px" height="52px" className="skeleton-avatar" />
              <div className="conversation-info" style={{ width: "100%" }}>
                <Skeleton variant="text" width="70%" height="20px" />
                <Skeleton variant="text" width="100%" height="16px" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Message Thread Skeleton */}
      <div className="message-thread">
        <div className="thread-header">
          <div className="thread-user-info">
            <Skeleton variant="rect" width="48px" height="48px" className="skeleton-avatar" />
            <div>
              <Skeleton variant="text" width="150px" height="22px" />
              <Skeleton variant="text" width="100px" height="16px" />
            </div>
          </div>
        </div>

        <div className="messages-list">
          {/* Message bubbles skeleton */}
          <div className="message-bubble other">
            <Skeleton variant="rect" width="36px" height="36px" className="skeleton-avatar" />
            <div style={{ display: "flex", flexDirection: "column", gap: "8px", width: "60%" }}>
              <Skeleton variant="text" width="100px" height="16px" />
              <Skeleton variant="rect" width="100%" height="60px" className="skeleton-message" />
            </div>
          </div>

          <div className="message-bubble own" style={{ flexDirection: "row-reverse" }}>
            <Skeleton variant="rect" width="36px" height="36px" className="skeleton-avatar" />
            <div style={{ display: "flex", flexDirection: "column", gap: "8px", width: "50%", alignItems: "flex-end" }}>
              <Skeleton variant="rect" width="100%" height="50px" className="skeleton-message" />
            </div>
          </div>

          <div className="message-bubble other">
            <Skeleton variant="rect" width="36px" height="36px" className="skeleton-avatar" />
            <div style={{ display: "flex", flexDirection: "column", gap: "8px", width: "55%" }}>
              <Skeleton variant="text" width="100px" height="16px" />
              <Skeleton variant="rect" width="100%" height="70px" className="skeleton-message" />
            </div>
          </div>
        </div>

        <div className="message-input-form">
          <Skeleton variant="rect" width="100%" height="48px" className="skeleton-input" />
          <Skeleton variant="rect" width="48px" height="48px" className="skeleton-button" />
        </div>
      </div>
    </div>
  );
}
