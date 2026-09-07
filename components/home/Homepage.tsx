import type { Post } from "@/data/cms-types";
import Blogs from "./Blogs";
import CustomerSuccess from "./CustomerSuccess";
import Hero from "./Hero";
import Innovation from "./Innovation";
import JoinTeam from "./JoinTeam";
import Kivo from "./Kivo";
import PBVideo from "./PBVideo";

interface HomepageProps {
  posts: Post[];
}

const Homepage = ({ posts }: HomepageProps) => {

  return (
    <>
      <Hero/>
      <Innovation/>
      <Kivo/>
      <CustomerSuccess/>
      {/* <PBVideo/> */}
      <JoinTeam/>
      <Blogs posts={posts}/>
    </>
  )
}

export default Homepage
