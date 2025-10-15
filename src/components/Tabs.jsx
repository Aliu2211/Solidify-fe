import { useState } from "react";
import { useNavigate } from "react-router-dom";

const tabs = [
  {
    icon: "home",
    page: "/home",
    tooltip: "Dashboard",
  },
  {
    icon: "newsstand",
    page: "/news",
    tooltip: "News Section",
  },
  {
    icon: "relax",
    page: "/sustainability-choices",
    tooltip: "Sustainability",
  },
  {
    icon: "menu_book",
    page: "/knowledge-base",
    tooltip: "Knowledge",
  },
  {
    icon: "chat",
    page: "/chat",
    tooltip: "Chat",
  },
  {
    icon: "crowdsource",
    page: "/people",
    tooltip: "People",
  },
  {
    icon: "settings",
    page: "/settings",
    tooltip: "Settings",
  },
];

// setting default selected tab for each page route
let defaultTab = "home";

export function Tabs() {
  const [selected, setSelected] = useState(defaultTab);

  function handleSelection(tab) {
    setSelected(tab);
  }

  return (
    <section className="tabs">
      {tabs.map((tab) => (
        <Tab
          page={tab.page}
          selected={selected}
          onSelection={handleSelection}
          tooltip={tab.tooltip}
          key={tab.icon}
        >
          {tab.icon}
        </Tab>
      ))}
    </section>
  );
}

function Tab({ children, onSelection, selected, page, tooltip }) {
  const isSelected = selected === children;
  const navigate = useNavigate();

  return (
    <span
      className={`material-symbols-outlined ${isSelected && "selected"}`}
      onClick={() => {
        navigate(page);
        onSelection(children);
        defaultTab = children;
      }}
    >
      {children}

      <span className="tooltip">{tooltip}</span>
    </span>
  );
}
