import { Header } from "./Header";
import { Feed } from "./Feed";
import { Profile } from "./Profile";
import { Roadmap } from "./Roadmap";
import { Outlet } from "react-router-dom";

const newsFeed = [
  {
    title: "Cillum laboris voluptate sit id in do sunt.",
    image: "https://picsum.photos/600/400?random=1",
    content:
      "Major technology companies are investing heavily in next-generation artificial intelligence, aiming to surpass current limitations and redefine automation across industries. Enim aute Lorem deserunt et excepteur incididunt ea enim occaecat ullamco sint amet aliqua. Laborum magna esse ut aliquip voluptate Lorem veniam. Proident id quis ipsum Lorem ut duis commodo voluptate laborum cupidatat ad ex magna occaecat. Eiusmod fugiat officia enim deserunt amet enim eu. Officia amet tempor eiusmod proident officia nisi cillum mollit. Id anim commodo do aliqua non adipisicing officia veniam.",
  },
  {
    title: "Labore veniam in fugiat ipsum.",
    image: "https://picsum.photos/600/400?random=2",
    content:
      "Stock markets worldwide rallied today as new data showed a steady decline in inflation, boosting investor confidence and signaling potential rate cuts.",
  },
  {
    title: "Ea dolore voluptate sunt adipisicing.",
    image: "https://picsum.photos/600/400?random=3",
    content:
      "Scientists have uncovered new species thriving in the depths of the Pacific, revealing insights into how marine life adapts to extreme conditions.",
  },
];

export function DashboardLayout() {
  return <Outlet />;
}

export default function Dashboard() {
  return (
    <div className="dashboard">
      <Header defaultTab="home">
        <Profile />
      </Header>

      <Body className="home">
        <RoadmapProgress />
        <NewsInAView />
      </Body>
    </div>
  );
}

export function Body({ children, className }) {
  return <div className={`content ${className}`}>{children}</div>;
}

function RoadmapProgress() {
  return (
    <div className="roadmap-progress">
      <span>Roadmap Progress</span>

      <section>
        {/* <img src="https://i.pravatar.cc/300" alt="" />
        <img src="https://i.pravatar.cc/300" alt="" />
        <img src="https://i.pravatar.cc/300" alt="" />
        <img src="https://i.pravatar.cc/300" alt="" />
        <img src="https://i.pravatar.cc/300" alt="" /> */}

        <Roadmap />
      </section>
    </div>
  );
}

function NewsInAView() {
  return (
    <div className="news-in-a-view">
      <span>News in a View</span>
      <section className="news-overview">
        {newsFeed.map((news) => (
          <Feed feedItem={news} />
        ))}
      </section>
    </div>
  );
}
