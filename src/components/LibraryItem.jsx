import React from "react";
import { useNavigate } from "react-router-dom";
import { TextExpander } from "./TextExpander";

export default function LibraryItem({ item }) {
  const navigate = useNavigate();
  const { id, title, summary, image, date, category } = item;

  const openDetail = (e) => {
    // prevent nested anchor default if needed
    e?.preventDefault?.();
    // navigate using id or slug - choose the field you have
    navigate(`${encodeURIComponent(id || item.slug)}`);
  };

  return (
    <article
      className="library-card"
      role="listitem"
      onClick={openDetail}
      style={{ cursor: "pointer" }}
    >
      {image ? (
        <div className="library-image-container">
          <img src={image} alt={title} className="library-image" />
        </div>
      ) : (
        <div className="library-image-skeleton" />
      )}

      <div className="library-content">
        <h3 className="library-title">{title}</h3>
        {summary && (
          <p className="library-text">
            <TextExpander
              collapsedNumWords={7}
              expandButtonText="Read More"
              collapseButtonText="Read Less"
            >
              {summary}
            </TextExpander>
          </p>
        )}
        <div className="library-footer">
          {date && (
            <time className="library-card__date">
              {new Date(date).toLocaleDateString()}
            </time>
          )}
          {category && <span className="library-category">{category}</span>}
        </div>
      </div>
    </article>
  );
}
