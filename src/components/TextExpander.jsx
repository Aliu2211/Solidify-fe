import { useState } from "react";

export function TextExpander({
  collapsedNumWords = 10,
  expandButtonText = "Show More",
  collapseButtonText = "Show Less",
  buttonColor,
  expanded = false,
  className,
  children,
}) {
  const [isExpanded, setIsExpanded] = useState(expanded);

  const buttonStyle = {
    color: buttonColor || "var(--color-primary)",
    position: "absolute",
    bottom: "-17px",
    right: "10px",
    border: "none",
    background: "none",
    fontSize: "16px",
    fontWeight: "900",
  };

  const totalWords = children.split(" ");

  let wordsToDisplay;

  if (isExpanded) {
    wordsToDisplay = children;
  }

  if (!isExpanded) {
    wordsToDisplay = totalWords.slice(0, collapsedNumWords).join(" ");
  }

  return (
    <div
      style={{ position: "relative" }}
      className={className}
      onClick={() => !expanded}
    >
      <span>{isExpanded ? wordsToDisplay : `${wordsToDisplay}... `}</span>

      <button style={buttonStyle} onClick={() => setIsExpanded(!isExpanded)}>
        {isExpanded ? collapseButtonText : expandButtonText}
      </button>
    </div>
  );
}
