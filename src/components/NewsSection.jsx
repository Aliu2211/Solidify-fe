import { Body } from "./Dashboard";
import { Header } from "./Header";
import { Feed } from "./Feed";

const newsData = [
  {
    title: "Sint sint excepteur amet qui mollit et Lorem minim.",
    image: "https://picsum.photos/800/500?random=1",
    content:
      "A breakthrough in renewable energy promises cheaper, cleaner power for millions.Elit do dolore laborum pariatur ut ullamco et aliquip. Ipsum in commodo ipsum ut. Nostrud deserunt voluptate fugiat elit quis cupidatat quis mollit dolor aliqua et do adipisicing non. Est deserunt aute exercitation proident amet consequat ipsum nulla ex irure sit. Ea anim esse est proident laborum duis Lorem nisi dolor. Ullamco nisi irure deserunt esse.Mollit eiusmod ad labore ullamco magna exercitation proident labore ex occaecat sunt. Pariatur in ut occaecat proident tempor consectetur nulla duis enim officia id. Aute mollit ad aliquip nulla id officia consequat. Id laboris enim minim velit irure enim adipisicing sint fugiat. Sunt anim esse do in excepteur reprehenderit. Deserunt nostrud ea Lorem consequat veniam est consectetur ut dolore fugiat minim. Ipsum ea aliquip culpa excepteur cillum aliqua ullamco sit proident.",
  },
  {
    title:
      "Fugiat pariatur cillum id aliquip deserunt pariatur sint commodo quis amet excepteur veniam adipisicing labore.",
    image: "https://picsum.photos/800/500?random=2",
    content:
      "Global markets rally as tech stocks surge following major earnings reports.Quis et adipisicing fugiat consectetur. Ut consequat sunt elit culpa cupidatat et est nisi laboris nisi non nostrud anim nisi. Mollit magna ad ullamco veniam qui culpa ad ut. Magna amet occaecat et ullamco minim do dolore ipsum. Et excepteur id amet dolore fugiat mollit commodo dolor.Exercitation dolor mollit ad exercitation tempor. Do elit elit anim duis veniam officia ullamco adipisicing ipsum nulla in. Culpa nostrud sunt esse commodo Lorem reprehenderit qui ea reprehenderit officia. Deserunt dolor culpa ex consectetur ex quis anim exercitation aliquip pariatur in. Quis nisi aute id ipsum occaecat. In cupidatat cillum ex dolor laboris irure velit labore proident laboris consequat ipsum.",
  },
  {
    title: "Id sint sint esse ea nulla enim pariatur dolore deserunt.",
    image: "https://picsum.photos/800/500?random=3",
    content:
      "Scientists discover a new exoplanet that may have conditions suitable for life.Fugiat nulla in sit do consequat qui. Amet sunt officia minim tempor amet proident. Amet fugiat enim eiusmod sit est nostrud minim quis cupidatat et. Veniam amet aliquip do laboris laboris commodo adipisicing laboris elit adipisicing sunt ea.Minim laborum pariatur pariatur veniam nulla irure reprehenderit est ad. Qui consequat aute laborum amet laboris sit ut velit duis officia. Eiusmod magna laborum ex reprehenderit. Esse anim tempor commodo sint cupidatat ad nulla voluptate excepteur mollit ullamco mollit voluptate elit. Elit occaecat sint commodo in reprehenderit duis dolor excepteur culpa eiusmod occaecat Lorem fugiat laboris.",
  },
  {
    title: "Nostrud fugiat voluptate esse eu.",
    image: "https://picsum.photos/800/500?random=4",
    content:
      "Local communities unite to clean up rivers and protect endangered wildlife.Amet fugiat cupidatat ipsum id aliquip cillum aute quis dolor excepteur sint. Labore eiusmod aliquip adipisicing dolor mollit. Sunt reprehenderit id officia nostrud ex mollit nostrud culpa magna. Mollit velit proident laboris sint esse ullamco commodo ullamco esse nisi nisi. Est ad consectetur ea aliquip. Et mollit est consectetur elit nulla nisi enim id sit ut sint.Esse commodo aliqua velit minim reprehenderit duis nostrud proident culpa Lorem eiusmod anim eiusmod. Cillum exercitation et in sit nostrud cupidatat mollit cillum commodo voluptate anim. Commodo sunt ullamco voluptate enim do dolor minim.",
  },
  {
    title:
      "Sunt reprehenderit in aliquip irure consequat ullamco culpa proident laboris.",
    image: "https://picsum.photos/800/500?random=5",
    content:
      "AI-driven robots are reshaping the Commodo est magna proident dolore ex Lorem qui deserunt. Veniam enim non elit irure duis do deserunt qui ex proident veniam occaecat enim aute. Ea nulla aliquip labore eiusmod in minim est. Laboris occaecat anim eu do mollit quis eiusmod reprehenderit id eiusmod ut laboris do. Ullamco sint labore eiusmod eiusmod elit tempor officia excepteur. Ex culpa do adipisicing id eu reprehenderit anim proident exercitation laboris aliqua irure. Amet tempor ex tempor cillum ea labore anim officia do tempor consequat cupidatat occaecat Lorem. Commodo fugiat fugiat ad ipsum labore fugiat exercitation Lorem enim enim. Labore esse dolor amet aliqua veniam irure cupidatat. Esse exercitation reprehenderit qui est voluptate aute.manufacturing industry across Europe.Quis esse reprehenderit laboris nisi ut ullamco cupidatat officia Lorem enim cillum deserunt. Deserunt incididunt Lorem occaecat do nostrud elit minim adipisicing consequat aliqua labore nulla esse. Deserunt in excepteur voluptate eu anim Lorem in esse eiusmod amet ipsum. Incididunt officia labore ad laborum esse officia proident magna aliquip. Consectetur aute incididunt exercitation sint et.Dolor minim fugiat aliquip esse pariatur pariatur anim proident enim. Ullamco fugiat Lorem enim dolore enim cillum eiusmod. Consectetur amet nisi ipsum enim nostrud ea. Sint duis sint cillum voluptate anim.",
  },
  {
    title: "Reprehenderit minim non cillum commodo.",
    image: "https://picsum.photos/800/500?random=6",
    content:
      "Major city announces ambitious plans to become carbon neutral by 2035.Magna nulla irure qui exercitation consequat amet. Pariatur cillum aliqua sit nostrud excepteur veniam. Quis consequat Lorem aliquip nulla nostrud amet velit mollit aliquip esse incididunt ad veniam mollit. Minim cillum nulla adipisicing est ullamco et enim adipisicing eu anim sint irure fugiat ut. Adipisicing ea aliqua ad est exercitation mollit ut excepteur. Cillum adipisicing eu voluptate esse labore laborum. Laborum mollit eiusmod minim eiusmod labore laborum proident reprehenderit veniam. Anim quis voluptate ipsum anim sit non sit esse cupidatat amet nostrud anim in id. Ipsum duis esse consectetur pariatur proident elit officia do laborum. Aliqua labore ullamco eu laborum ad minim velit exercitation exercitation non. Nisi eiusmod occaecat excepteur magna sit sit.",
  },
  {
    title: "Aliquip in id et id incididunt officia.",
    image: "https://picsum.photos/800/500?random=7",
    content:
      "Health experts report promising results from a new vaccine trial.Et minim non cillum duis enim ex cupidatat sint incididunt. Duis consectetur laborum nisi aute ullamco amet quis ullamco proident aliquip eu nulla occaecat cupidatat. Culpa do occaecat amet voluptate ad consectetur amet labore enim. Nostrud et aliquip mollit adipisicing cupidatat ad do ea ipsum proident pariatur elit. Anim commodo aliquip aliqua tempor consequat. Magna excepteur do eu Lorem non incididunt reprehenderit cillum est commodo consequat id deserunt. Duis pariatur proident non voluptate tempor fugiat Lorem. Ipsum cupidatat aliquip aliquip dolore proident esse est amet laborum laboris occaecat. Excepteur consequat pariatur proident consectetur mollit commodo fugiat elit ad. Elit aute ea esse ut cupidatat eiusmod exercitation Lorem cupidatat eiusmod proident. Tempor cillum elit irure incididunt ex ullamco deserunt ex. Elit culpa est minim adipisicing qui culpa dolor minim eu amet elit ea. Magna id consequat adipisicing id aliquip proident deserunt duis Lorem sit labore.",
  },
  {
    title:
      "Sunt ut laborum proident reprehenderit officia cillum nostrud excepteur voluptate qui aliquip deserunt pariatur.",
    image: "https://picsum.photos/800/500?random=8",
    content:
      "Breakthrough in quantum computing could revolutionize data security.Dolore nostrud enim eu cupidatat cupidatat reprehenderit. Commodo reprehenderit ullamco eu esse occaecat in irure. Laborum id aute magna nostrud aliqua ipsum ut laboris consectetur eiusmod. Cupidatat cillum amet enim voluptate velit quis cupidatat. Pariatur quis cillum esse laboris sunt cupidatat id non. Ea ea magna aute proident anim sit incididunt ut officia. Veniam esse sint consequat irure anim dolore magna Lorem. Est labore exercitation dolore nisi est ea ut eu amet consequat sunt ullamco magna. Occaecat eu eu ut aliqua in cupidatat. Mollit est est non ullamco ad aliquip laborum consequat id adipisicing fugiat culpa.",
  },
  {
    title: "Culpa quis proident sint aliqua et ea et commodo in.",
    image: "https://picsum.photos/800/500?random=9",
    content:
      "Sports fans celebrate as underdog team claims victory in a dramatic final.Dolore deserunt Lorem consectetur in reprehenderit. Ad adipisicing id nisi dolor nulla adipisicing. Id eu nisi velit commodo. Nostrud id est irure anim fugiat reprehenderit irure magna tempor exercitation ex consectetur minim. Quis consequat eu minim tempor aliqua. Aliqua mollit minim laboris amet. Exercitation culpa laboris id irure excepteur mollit. Fugiat sint ipsum cupidatat magna id eiusmod laborum incididunt Lorem ea.",
  },
];

export default function NewsSection() {
  return (
    <div className="news-section">
      <Header defaultTab="newsstand" />
      <Body className="news">
        <Heading>News</Heading>
        <NewsRows />
      </Body>
    </div>
  );
}

export function Heading({ children }) {
  const headingStyle = {
    display: "flex",
    alignItems: "center",
    gap: "20px",
  };
  const headingTextStyle = {
    backgroundColor: "var(--color-secondary)",
    fontSize: "20px",
    padding: "10px 15px",
    fontWeight: "600",
  };
  const barStyle = {
    backgroundColor: "#000",
    flex: "1",
    borderRadius: "30px",
  };
  return (
    <div style={headingStyle}>
      <span style={headingTextStyle}>{children}</span>
      <span style={barStyle} className="bar"></span>
    </div>
  );
}

function NewsRows() {
  return (
    <div className="news-grid">
      {newsData.map((news) => (
        <Feed feedItem={news} className={"news-border-bottom"} />
      ))}
    </div>
  );
}
