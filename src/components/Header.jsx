import { Search } from "./Search";
import { Tabs } from "./Tabs";

export function Header({ children, defaultTab }) {
  return (
    <div className="header">
      {/* search */}
      <Search />

      {/* icons */}
      <Tabs defaultTab={defaultTab} />

      {/* profile */}
      {children}
    </div>
  );
}
