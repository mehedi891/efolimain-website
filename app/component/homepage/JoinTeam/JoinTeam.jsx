import { Link } from "react-router"
import careerImg1 from "./1.webp";
import careerImg2 from "../../../images/team_saint.webp";
import careerImg3 from "../../../images/ty_ja.webp";
import ButtonWithIcon from "../../ButtonWithIcon/ButtonWithIcon"
import AnimatedSection from "../../AnimatedSection/AnimatedSection"

const JoinTeam = () => {
  return (
    <section className="md:pt-20 pt-0">
      <AnimatedSection>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 pb-14 sm:pb-10 lg:pb-24 md:pt-10 pt-0">
          <div className="flex items-end md:justify-between  flex-wrap gap-4">
            <h2 className="md:text-5xl/[1.13] text-3xl/snug max-w-[637px] font-bold font-display text-left">Creative Minds, One Team,Endless Growth</h2>
            <Link to="/career">
              <ButtonWithIcon text1="Join The Team" text2="Join The Team" pClass="text-base font-semibold" />
            </Link>
          </div>

          <div className="md:grid flex flex-wrap grid-cols-12 gap-6 mt-8 md:mt-15 [grid-template-areas:'A_A_A_A_B_B_B_C_C_C_C_C''A_A_A_A_D_D_D_D_D_E_E_E']">

            <div className="[grid-area:A] hidden md:block">
              <img src={careerImg1} alt="Career Image 1" loading="lazy" className="h-full w-full object-fill rounded-2xl" />
            </div>
            <div className="[grid-area:B] hidden md:block">
              <div className="rounded-[20px] bg-[#D7FBEA] p-6 w-full h-full">
                <div className="h-full flex flex-col justify-between">
                  <div className=" text-[#235D3A] text-xl font-semibold font-display">Team Members</div>
                  <div className="text-4xl md:text-6xl font-bold text-[#235D3A] font-display">30+</div>
                </div>
              </div>
            </div>
            <div className="[grid-area:C]">
              <img src={careerImg2} alt="Career Image 2" loading="lazy" className="rounded-2xl w-full h-full" />
            </div>
            <div className="[grid-area:D] hidden md:block">
              <img src={careerImg3} alt="Career Image 3" loading="lazy" className="  h-full rounded-2xl" />
            </div>
            <div className="[grid-area:E] md:w-full w-[45%]">
              <div className="rounded-[20px] bg-[#FFD4EE] md:p-6 p-4 w-full h-full">
                <div className="h-full flex flex-col justify-between">
                  <div className=" text-[#6F3055] font-semibold text-base md:text-xl font-display">Years In Business</div>
                  <div className="md:text-6xl text-4xl font-bold text-[#6F3055] font-display">15+</div>
                </div>
              </div>
            </div>

            <div className="md:hidden w-[45%] h-[120px]">
              <div className="rounded-[20px] bg-[#D7FBEA] p-4 w-full h-full">
                <div className="h-full flex flex-col justify-between">
                  <div className="text-[#235D3A] text-base md:text-xl font-medium font-display">Team Members</div>
                  <div className="md:text-6xl text-4xl font-bold text-[#235D3A] font-display">30+</div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </AnimatedSection>
    </section>
  )
}

export default JoinTeam