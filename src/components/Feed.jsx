import { TextExpander } from "./TextExpander";

export function Feed({ feedItem, className }) {
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
      <img src={feedItem.image} alt="image" />
      <span>
        {
          <TextExpander
            expandButtonText="View Full Title"
            collapseButtonText="Read Less"
            collapsedNumWords={8}
          >
            {feedItem.title}
          </TextExpander>
        }
      </span>
    </div>
  );
}
