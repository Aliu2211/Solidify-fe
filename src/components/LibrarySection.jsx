import { useEffect, useState } from "react";
import { Body } from "./Dashboard";
import { Header } from "./Header";
import LibraryItem from "./LibraryItem";
import LibraryPageHeader from "./LibraryPageHeader";

// Sample static data for demonstration; replace with API/store call by backend developer
// const sampleLibrary = [
//   {
//     id: "lib-1",
//     title: "Net Zero Strategy: A Practical Guide",
//     image: "https://picsum.photos/800/500?random=11",
//     summary:
//       "A concise guide to building a practical net-zero plan for tech SMEs, including templates and checklists.",
//     link: "#",
//     category: "Guides",
//     date: "2025-09-10",
//   },
//   {
//     id: "lib-2",
//     title: "Sustainability Reporting Template 2025",
//     image: "https://picsum.photos/800/500?random=12",
//     summary:
//       "Download the 2025 reporting template to standardise sustainability disclosures across your organisation.",
//     link: "#",
//     category: "Templates",
//     date: "2025-08-02",
//   },
//   {
//     id: "lib-3",
//     title: "Case Study: Carbon Reduction at Acme Tech",
//     image: "https://picsum.photos/800/500?random=13",
//     summary:
//       "How Acme Tech reduced emissions by 40% over two years — lessons and practical steps.",
//     link: "#",
//     category: "Case Studies",
//     date: "2025-07-22",
//   },
// ];

export default function LibrarySection() {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [items, setItems] = useState([]);

  useEffect(() => {
    // replace with real API/store call
    const sampleLibrary = [
      {
        id: "lib-1",
        title: "Net Zero Strategy: A Practical Guide",
        image: "https://picsum.photos/800/500?random=11",
        summary:
          "A concise guide to building a practical net-zero plan for tech SMEs, including templates and checklists.",
        category: "Guides",
        date: "2025-09-10",
      },
      {
        id: "lib-2",
        title: "Sustainability Reporting Template 2025",
        image: "https://picsum.photos/800/500?random=12",
        summary:
          "Download the 2025 reporting template to standardise sustainability disclosures across your organisation.",
        category: "Templates",
        date: "2025-08-02",
      },
      {
        id: "lib-3",
        title: "Case Study: Carbon Reduction at Acme Tech",
        image: "https://picsum.photos/800/500?random=13",
        summary:
          "How Acme Tech reduced emissions by 40% over two years — lessons and practical steps.",
        category: "Case Studies",
        date: "2025-07-22",
      },
    ];
    setItems(sampleLibrary);
  }, []);

  useEffect(() => {
    // Update the total resources count in the DOM
    const el = document.getElementById("total-resources");
    if (el) {
      el.textContent = String(items.length ?? 0);
    }
  }, [items.length]);

  const categories = [
    { value: "", label: "All Books", icon: "📚" },
    { value: "Guides", label: "Guides", icon: "📖" },
    { value: "Templates", label: "Templates", icon: "📝" },
    { value: "Case Studies", label: "Case Studies", icon: "📊" },
    { value: "Reports", label: "Reports", icon: "📄" },
    { value: "Tools", label: "Tools", icon: "🛠️" },
  ];

  const filtered = items.filter((it) => {
    if (selectedCategory && it.category !== selectedCategory) return false;
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      it.title.toLowerCase().includes(q) ||
      (it.summary && it.summary.toLowerCase().includes(q)) ||
      (it.category && it.category.toLowerCase().includes(q))
    );
  });

  return (
    <div className="library-section-page">
      <Header defaultTab="menu_book" />
      <Body className="library">
        <LibraryPageHeader total={filtered.length} />

        <div className="library-filter-section">
          <div className="library-search-container">
            <div className="library-search-wrapper">
              <span className="search-icon">🔎</span>
              <input
                type="text"
                placeholder="Search library..."
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

          <div className="library-category-pills">
            {categories.map((cat) => (
              <button
                key={cat.value}
                className={`category-pill ${
                  selectedCategory === cat.value ? "active" : ""
                }`}
                onClick={() => setSelectedCategory(cat.value)}
              >
                <span className="pill-icon">{cat.icon}</span>
                <span className="pill-label">{cat.label}</span>
              </button>
            ))}
          </div>
        </div>

        {filtered.length !== 0 && (
          <div className="library-results-header">
            <p className="results-count">
              Showing <strong>{filtered.length}</strong> resource
              {filtered.length !== 1 ? "s" : ""}
              {selectedCategory && (
                <span>
                  {" "}
                  in <strong>{selectedCategory}</strong>
                </span>
              )}
              {searchQuery && (
                <span>
                  {" "}
                  matching "<strong>{searchQuery}</strong>"
                </span>
              )}
            </p>
          </div>
        )}

        <div className="library-grid-page">
          {filtered.length === 0 ? (
            <div className="library-empty-state">
              <div className="empty-state-content">
                <span className="empty-state-icon">📗</span>
                <h3>No resources found</h3>
                <p>Try adjusting your search or select a different category.</p>
              </div>
            </div>
          ) : (
            filtered.map((item) => <LibraryItem key={item.id} item={item} />)
          )}
        </div>
      </Body>
    </div>
  );
}
