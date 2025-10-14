import { Search } from "./Search";
import { Tabs } from "./Tabs";

export function Header({ children }) {
  return (
    <div className="header">
      {/* search */}
      <Search />

      {/* icons */}
      <Tabs />

      {/* profile */}
      {children}
    </div>
  );
}
