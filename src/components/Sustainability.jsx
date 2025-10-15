import { Body } from "./Dashboard";
import { Header } from "./Header";
import { Heading } from "./NewsSection";
import { Contents } from "./Contents";

const tempLevels = [
  {
    id: 1,
    title: "Foundation & Measurement",
    message:
      "Dolore magna sint tempor non nisi laborum exercitation qui. Aliquip elit laborum qui amet duis. Occaecat est minim eiusmod et deserunt adipisicing occaecat deserunt irure velit reprehenderit.",
  },

  {
    id: 2,
    title: "Efficiency and Integration",
    message:
      "Ad officia consectetur Lorem enim ullamco mollit anim labore ipsum nulla non eiusmod. Culpa sit aute sint ea est dolore aliquip nisi pariatur commodo eiusmod laborum cillum. Et laborum non nostrud et nisi aliqua elit sint irure dolore. Voluptate aliquip laboris voluptate commodo proident adipisicing ullamco nisi exercitation amet in cupidatat sint.",
  },

  {
    id: 3,
    title: "Transformation & Net Zero Leadership",
    message:
      "Duis amet eu voluptate excepteur eu adipisicing officia aute exercitation dolore id laboris qui reprehenderit. Enim deserunt dolor velit irure voluptate. Nulla elit aute pariatur occaecat excepteur. Commodo est esse do excepteur tempor do aliqua adipisicing eu anim enim. Exercitation exercitation nisi quis sint irure veniam.",
  },
];

export default function Sustainability() {
  return (
    <div>
      <Header defaultTab="relax" />

      <Body className="sustainability">
        <Heading>Sustainability Choices</Heading>

        <Contents levels={tempLevels} />
      </Body>
    </div>
  );
}
