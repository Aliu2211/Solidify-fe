import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useChatStore from "../stores/chatStore";

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
    page: "/library",
    tooltip: "Library",
  },
  {
    icon: "chat",
    page: "/chat",
    tooltip: "Chat",
    showBadge: true,
  },
  {
    icon: "crowdsource",
    page: "/find-SME",
    tooltip: "Find SME",
  },
  {
    icon: "settings",
    page: "/settings",
    tooltip: "Settings",
  },
];

export function Tabs({ defaultTab }) {
  const [selected, setSelected] = useState(defaultTab);
  const getTotalUnreadCount = useChatStore((state) => state.getTotalUnreadCount);
  const unreadCount = getTotalUnreadCount();

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
          unreadCount={tab.showBadge ? unreadCount : 0}
        >
          {tab.icon}
        </Tab>
      ))}
    </section>
  );
}

function Tab({ children, onSelection, selected, page, tooltip, unreadCount }) {
  const isSelected = selected === children;
  const navigate = useNavigate();

  return (
    <span
      className={`material-symbols-outlined tab-icon ${isSelected && "selected"}`}
      onClick={() => {
        navigate(page);
        onSelection(children);
      }}
    >
      {children}

      {unreadCount > 0 && (
        <span className="unread-badge-header">{unreadCount > 99 ? '99+' : unreadCount}</span>
      )}

      <span className="tooltip">{tooltip}</span>
    </span>
  );
}
