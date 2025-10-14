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

  const totalWords = children.split(" ");

  let wordsToDisplay;

  if (isExpanded) {
    wordsToDisplay = children;
  }

  if (!isExpanded) {
    wordsToDisplay = totalWords.slice(0, collapsedNumWords).join(" ");
  }

  return (
    <div className={className} onClick={() => !expanded}>
      <span>{isExpanded ? wordsToDisplay : `${wordsToDisplay}... `}</span>

      <button
        style={{ color: buttonColor }}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {isExpanded ? collapseButtonText : expandButtonText}
      </button>
    </div>
  );
}
