import { Header } from "./Header";
import { News } from "./News";
import { Profile } from "./Profile";
import { Roadmap } from "./Roadmap";

const newsFeed = [
  {
    image: "https://picsum.photos/600/400?random=1",
    content:
      "Major technology companies are investing heavily in next-generation artificial intelligence, aiming to surpass current limitations and redefine automation across industries.",
  },
  {
    image: "https://picsum.photos/600/400?random=2",
    content:
      "Stock markets worldwide rallied today as new data showed a steady decline in inflation, boosting investor confidence and signaling potential rate cuts.",
  },
  {
    image: "https://picsum.photos/600/400?random=3",
    content:
      "Scientists have uncovered new species thriving in the depths of the Pacific, revealing insights into how marine life adapts to extreme conditions.",
  },
];

export default function Dashboard() {
  return (
    <div className="dashboard">
      <Header>
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
          <News news={news} />
        ))}
      </section>
    </div>
  );
}
