const heroImg = "/img/career/careerHero.webp";

const CareerHero = () => {
  return (
    <section>
      <div className="max-w-7xl mx-auto md:py-30 md:pt-15 py-10 px-4">
        <h1 className="font-bold text-3xl md:text-7xl/[1.13] md:tracking-[-2.16px] md:mb-5 mb:0 text-[#13181E] font-display">Build Your Future With Us<br /> and Grow Your Career</h1>
        <div className="md:mt-15 mt-10 flex items-start">
          <img src={heroImg} alt="Career" loading="lazy" className="max-w-full object-contain rounded-3xl" />
        </div>
      </div>
    </section>
  );
};

export default CareerHero;
