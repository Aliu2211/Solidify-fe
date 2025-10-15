import { useState } from "react";

export function Contents({ levels }) {
  const [selectedLevel, setSelectedLevel] = useState();

  function handleSelection(level) {
    setSelectedLevel(level !== selectedLevel ? level : null);
  }

  return (
    <div className="contents">
      <TableOfContents
        levels={levels}
        selectedLevel={selectedLevel}
        onSelection={handleSelection}
      />

      {selectedLevel && <SelectedContent selectedLevel={selectedLevel} />}
    </div>
  );
}

function TableOfContents({ levels, selectedLevel, onSelection }) {
  return (
    <div>
      <h6>Select Current Level</h6>

      <section>
        {/* <h3>Level 1</h3>
            <h3>Level 2</h3>
            <h3>Level 3</h3> */}

        {levels.map((level, index) => (
          <h5
            className={selectedLevel === level && "selected"}
            onClick={() => onSelection(level)}
          >
            Level {index + 1}: {level.title}
          </h5>
        ))}
      </section>
    </div>
  );
}

function SelectedContent({ selectedLevel }) {
  return <p>{selectedLevel.message}</p>;
}
