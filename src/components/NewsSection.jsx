import { Body } from "./Dashboard";
import { Header } from "./Header";
import { News } from "./News";

const newsData = [
  {
    image: "https://picsum.photos/seed/1/800/500",
    content:
      "A breakthrough in renewable energy promises cheaper, cleaner power for millions.",
  },
  {
    image: "https://picsum.photos/seed/2/800/500",
    content:
      "Global markets rally as tech stocks surge following major earnings reports.",
  },
  {
    image: "https://picsum.photos/seed/3/800/500",
    content:
      "Scientists discover a new exoplanet that may have conditions suitable for life.",
  },
  {
    image: "https://picsum.photos/seed/4/800/500",
    content:
      "Local communities unite to clean up rivers and protect endangered wildlife.",
  },
  {
    image: "https://picsum.photos/seed/5/800/500",
    content:
      "AI-driven robots are reshaping the manufacturing industry across Europe.",
  },
  {
    image: "https://picsum.photos/seed/6/800/500",
    content:
      "Major city announces ambitious plans to become carbon neutral by 2035.",
  },
  {
    image: "https://picsum.photos/seed/7/800/500",
    content:
      "Health experts report promising results from a new vaccine trial.",
  },
  {
    image: "https://picsum.photos/seed/8/800/500",
    content:
      "Breakthrough in quantum computing could revolutionize data security.",
  },
  {
    image: "https://picsum.photos/seed/9/800/500",
    content:
      "Sports fans celebrate as underdog team claims victory in a dramatic final.",
  },
];

export default function NewsSection() {
  return (
    <div className="news-section">
      <Header />
      <Body className="news">
        <Heading>News</Heading>
        <NewsRows />
      </Body>
    </div>
  );
}

function Heading({ children }) {
  const headingStyle = {
    display: "flex",
    alignItems: "center",
    gap: "20px",
  };
  const headingTextStyle = {
    backgroundColor: "var(--color-secondary)",
    fontSize: "20px",
    padding: "10px 15px",
    fontWeight: "600",
  };
  const barStyle = {
    backgroundColor: "#000",
    flex: "1",
    borderRadius: "30px",
  };
  return (
    <div style={headingStyle}>
      <span style={headingTextStyle}>{children}</span>
      <span style={barStyle} className="bar"></span>
    </div>
  );
}

function NewsRows() {
  return (
    <div className="news-grid">
      {newsData.map((news) => (
        <News news={news} className={"news-border-bottom"} />
      ))}
    </div>
  );
}
