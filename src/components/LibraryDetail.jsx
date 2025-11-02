import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Body } from "./Dashboard";
import { Header } from "./Header";
import { fetchLibraryItemById } from "../services/libraryApi";

export default function LibraryDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      try {
        const data = await fetchLibraryItemById(id);
        if (mounted) {
          setItem(data);
        }
      } catch (err) {
        if (mounted) {
          setError(err.message || "Failed to load resource");
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="library-detail-loading">
        <Header defaultTab="menu_book" />
        <Body className="library">
          <p>Loading...</p>
        </Body>
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="library-detail-error">
        <Header defaultTab="menu_book" />
        <Body className="library">
          <p>Error: {error || "Resource not found"}</p>
          <button onClick={() => navigate(-1)}>Back</button>
        </Body>
      </div>
    );
  }

  // expected fields: title, content/summary, imageUrl/image, link/fileUrl, date, category, author
  const title = item.title || item.name;
  const image = item.imageUrl || item.image || "";
  const content = item.content || item.summary || item.description || "";
  const fileUrl = item.fileUrl || item.url || item.link || null;
  const date = item.date || item.publishedAt || null;
  const category = item.category || null;
  const author = item.author || item.publisher || null;

  return (
    <div className="library-detail-page">
      <Header defaultTab="menu_book" />
      <Body className="library">
        <div className="library-detail-header">
          <button className="back-btn" onClick={() => navigate(-1)}>
            Back
          </button>
          <h1 className="library-detail-title">{title}</h1>
          <div className="library-detail-meta">
            {author && <span className="meta-item">By {author}</span>}
            {date && (
              <span className="meta-item">
                {new Date(date).toLocaleDateString()}
              </span>
            )}
            {category && <span className="meta-item">{category}</span>}
          </div>
        </div>

        {image && (
          <div className="library-detail-media">
            <img src={image} alt={title} />
          </div>
        )}

        <div
          className="library-detail-content"
          dangerouslySetInnerHTML={{ __html: content }}
        />

        <div className="library-detail-actions">
          {fileUrl && (
            <a
              className="btn btn-primary"
              href={fileUrl}
              target="_blank"
              rel="noreferrer"
            >
              Open / Download
            </a>
          )}
          <button
            className="btn"
            onClick={() => navigator.clipboard?.writeText(window.location.href)}
          >
            Copy Link
          </button>
        </div>
      </Body>
    </div>
  );
}
