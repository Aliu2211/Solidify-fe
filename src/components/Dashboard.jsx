import { Profile } from "./Profile";
import { Search } from "./Search";
import { Tabs } from "./Tabs";

export default function Dashboard() {
  return (
    <div className="dashboard">
      <Header>
        <Profile />
      </Header>

      <Body />
    </div>
  );
}

function Header({ children }) {
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

function Body() {
  return <div className="content"></div>;
}
