import Image from "next/image";
import heroImg from "@/public/img/career/careerHero.webp";

const CareerHero = () => {
  return (
    <section>
      <div className="max-w-7xl mx-auto md:py-30 md:pt-15 py-10 px-4">
        <h1 className="font-bold text-3xl md:text-7xl/[1.13] md:tracking-[-2.16px] md:mb-5 mb:0 text-[#13181E] font-display">Build Your Future With Us<br /> and Grow Your Career</h1>
        <div className="md:mt-15 mt-10 flex items-start">
          <Image src={heroImg} alt="Career" className="object-contain rounded-3xl w-full h-auto" sizes="(max-width: 1280px) 100vw, 1280px" priority />
        </div>
      </div>
    </section>
  );
};

export default CareerHero;
