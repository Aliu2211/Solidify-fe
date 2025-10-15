import { TextExpander } from "./TextExpander";

export function News({ news, className }) {
  const newsStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
    fontSize: "14px",
    fontWeight: "400",
    color: "#fff",
  };

  return (
    <div style={newsStyle} className={className}>
      <img src={news.image} alt="image" />
      <span>
        {
          <TextExpander
            expandButtonText="Read More"
            collapseButtonText="Read Less"
            collapsedNumWords={8}
          >
            {news.content}
          </TextExpander>
        }
      </span>
    </div>
  );
}
