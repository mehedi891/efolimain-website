import Image from "next/image";
import aboutHero from "@/public/img/about/aboutHero.webp";
import ceoImg from "@/public/img/about/ceoJA.webp";
const Family = () => {
  return (
    <section className="lg:mb-30 mb-6 relative">
       <div  className='max-w-7xl mx-auto md:-mt-60 mt-10 md:px-0 px-4'>
          <Image className='object-contain rounded-3xl w-full h-auto' src={aboutHero} alt="About Us" sizes="(max-width: 1280px) 100vw, 1280px" priority />
        </div>
      <div  className="max-w-7xl mx-auto md:mt-30 mt-10 md:px-0 px-4">
        <div className="flex flex-wrap lg:gap-40 gap-4">
          <div className="max-w-[850px]">
            <h2 className="md:text-5xl/[1.2] text-3xl font-bold font-display">We are the eFoli Family</h2>
            <div className="flex flex-col gap-4 mt-5">
              <p className="lg:text-[18px]/[1.67] text-[#4B5154]">More than 15 years ago, eFoli was founded with a clear purpose: to create solutions that merge innovation, creativity, and real-world impact. Since then, we’ve expanded our expertise across industries, building a global reputation for delivering technology that helps businesses grow, evolve, and thrive in an ever-changing digital world.</p>
              <p className="lg:text-[18px]/[1.67] text-[#4B5154]">Our greatest strength is our people - a team of passionate professionals, designers, and strategists who share one vision: to turn challenges into opportunities. From intuitive user experiences to scalable SaaS products, every project we craft reflects collaboration, precision, and care, ensuring that each solution we deliver drives long-term success.</p>
              <p className="lg:text-[18px]/[1.67] text-[#4B5154]">At eFoli, we don’t just focus on what’s now - we build what’s next.</p>
            </div>
          </div>

          <div className="max-w-[232px] flex flex-col gap-10 mt-10 lg:mt-0">
            <div>
              <h4 className="text-5xl lg:text-[58px] font-display font-bold pb-3 border-b border-[#13181E]">2010</h4>
              <span className="lg:text-xl mt-3 block">Founded</span>
            </div>

            <div>
              <h4 className="text-5xl lg:text-[58px] font-display font-bold pb-3 border-b border-[#13181E]">15k+</h4>
              <span className="lg:text-xl mt-3 block">Clients</span>
            </div>

            <div>
              <h4 className="text-5xl lg:text-[58px] font-display font-bold pb-3 border-b border-[#13181E]">50+</h4>
              <span className="lg:text-xl mt-3 block">Experts</span>
            </div>


          </div>
        </div>

        <div className="mt-5 lg:mt-30">
          <div className="flex items-center gap-3 flex-wrap lg:gap-24 bg-[#F1F5F9] rounded-[20px]">
            <Image src={ceoImg} alt="JA" className="object-contain max-h-[460px] w-auto h-auto" sizes="(max-width: 768px) 100vw, 700px" />
            <div className="max-w-[505px]">
              <h3 className="md:text-4xl/[1.38] text-2xl text-[#13181E] tracking-[-0.72px] font-display font-semibold text-center">“Behind every feature is a real merchant, and behind every success is a team that listens and builds with care.”</h3>
              <p className="mt-4 text-center"><strong>Jahangir Alam</strong> / Founder & CEO</p>
            </div>
          </div>
        </div>
      </div>
     
    </section>
  )
}

export default Family