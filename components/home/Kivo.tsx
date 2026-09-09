import Image from "next/image";
import kivoImg from "@/public/img/home/kivo.webp";
const kivoBg = "/img/home/service_bg.webp";
import Button from "@/components/Button";
import AnimatedSection from "@/components/AnimatedSection";
const Kivo = () => {
  return (
    <section style={{ backgroundImage: `url(${kivoBg})` }} className={`md:py-30 md:pb-8 p-10 bg-no-repeat bg-cover bg-center`}>
      <AnimatedSection>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 pb-14 sm:pb-20 lg:pb-24">
          <h3 className="text-lg text-center text-blue-500 font-[600]">Our Service</h3>
          <h2 className="font-display md:text-5xl/[1.25] text-3xl font-bold text-center pt-3 line">KivoSupport - White Label <br /> Customer Support</h2>

          <div className="md:mt-20 mt-15 flex flex-col-reverse md:flex-row gap-10 md:gap-6 items-center md:justify-between">
            <div className="w-full md:max-w-[550px]">
              <div className="pb-7 border-b border-[#e5e5e5]">
                <h3 className="font-display text-lg md:text-2xl font-bold">24/7 Technical Support</h3>
                <p className="pt-2 text-[#4b5154]">Round-the-clock technical care for your Shopify app users. Never miss a bug report, issue, or chance to impress.</p>
              </div>
              <div className="pb-7 border-b border-[#e5e5e5]">
                <h3 className="mt-6 font-display text-lg md:text-2xl font-bold">Live Chat, Call & Email Support</h3>
                <p className="pt-2 text-[#4b5154]">Real-time help through chat, calls, and emails, ensuring every customer gets the response they need, when they need it.</p>
              </div>
              <div className="pb-7">
                <h3 className="mt-6 font-display text-lg md:text-2xl font-bold">Documentation & Custom Support</h3>
                <p className="pt-2 text-[#4b5154]">We craft detailed docs, FAQs, and tailored support flows that grow with your app and reduce repetitive tickets.</p>
              </div>

              <div className="mt-2">

                <a
                  href={"https://calendly.com/efolisupport"}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button
                    pClass="rounded-lg px-6 py-3.5 font-medium text-white shadow-sm bg-[#0D99FF]"
                    text1="Schedule a Call"
                    text2="Schedule a Call"
                  />
                </a>

              </div>

            </div>

            <div className="w-full md:w-[600px] md:shrink-0">
              <Image className="object-cover w-full h-auto" src={kivoImg} alt="Multivariants" sizes="(max-width: 768px) 100vw, 600px" />
            </div>

          </div>


        </div>
      </AnimatedSection>
    </section>
  )
}

export default Kivo
