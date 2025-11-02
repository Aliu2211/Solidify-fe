import React from "react";

export default function LibraryPageHeader({ total = "..." }) {
  return (
    <div className="library-page-header">
      <div className="library-page-title-section">
        <h1 className="library-page-title">Library</h1>
        <p className="library-page-subtitle">
          Browse templates, guides, reports and case studies
        </p>
      </div>

      <div className="library-stats">
        <div className="library-stat-item">
          <span className="stat-icon">📚</span>
          <div>
            <p className="stat-label">Resources</p>
            <p className="stat-value" id="total-resources">
              {total}
            </p>
          </div>
        </div>

        <div className="library-stat-item">
          <span className="stat-icon">📂</span>
          <div>
            <p className="stat-label">Categories</p>
            <p className="stat-value">6</p>
          </div>
        </div>
      </div>
    </div>
  );
}
