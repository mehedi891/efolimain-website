import CareerHero from "./CareerHero/CareerHero"
import Faq from "./Faq/Faq"
import Jobs from "./Jobs/Jobs"
import ShowOffImg from "./ShowOffImg/ShowOffImg"

const Careerpage = ({ jobs = [] }) => {
  return (
    <>
      <CareerHero/>
      <Jobs jobs={jobs}/>
      <ShowOffImg/>
      <Faq/>
    </>
  )
}

export default Careerpage