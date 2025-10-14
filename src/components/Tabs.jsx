import { useState } from "react";
import { useNavigate } from "react-router-dom";

const tabs = [
  "home",
  "newsstand",
  "relax",
  "menu_book",
  "chat",
  "crowdsource",
  "settings",
];

export function Tabs() {
  const [selected, setSelected] = useState("home");

  function handleSelection(tab) {
    setSelected(tab);
  }

  return (
    <section className="tabs">
      {tabs.map((tab) => (
        <Tab selected={selected} onSelection={handleSelection}>
          {tab}
        </Tab>
      ))}
    </section>
  );
}

function Tab({ children, onSelection, selected }) {
  const isSelected = selected === children;

  return (
    <span
      className={`material-symbols-outlined ${isSelected && "selected"}`}
      onClick={() => onSelection(children)}
    >
      {children}
    </span>
  );
}
