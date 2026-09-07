import type { Job } from "@/data/jobs";
import CareerHero from "./CareerHero";
import Faq from "./Faq";
import Jobs from "./Jobs";
import ShowOffImg from "./ShowOffImg";

interface CareerpageProps {
  jobs?: Job[];
}

const Careerpage = ({ jobs = [] }: CareerpageProps) => {
  return (
    <>
      <CareerHero />
      <Jobs jobs={jobs} />
      <ShowOffImg />
      <Faq />
    </>
  );
};

export default Careerpage;
