import Form from "@/components/Form";

const cHero = "/img/contact/contactHero.webp";

const ContactHero = () => {
  return (
    <section
      style={{ backgroundImage: `url(${cHero})` }}
      className="md:py-20 py-10 text-white bg-cover bg-center pt-35 md:pt-50 relative -top-25"
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex max-w-[100%] items-start md:gap-20 gap-10 flex-wrap">
          <div className="flex flex-col gap-2 max-w-[520px] md:sticky md:top-32">
            <h1 className="md:text-7xl/[1.125] text-3xl font-bold font-display md:tracking-[-3.2px]">
              Let’s Build  <br />Something Great Together.
            </h1>
            <p className="md:text-2xl/[1.67] text-base md:mt-5 mt-2">
             Reach out to discuss new opportunities or simply connect at {" "}
              <a href="mailto:info@efoli.com" className="underline">
                info@efoli.com
              </a>.
            </p>
          </div>

         <Form
         fClass=""
         btnClass="px-6 py-3.5 font-medium bg-[#fff] text-[#020202]"
         btnTxt="Submit Message"
         />


        </div>
      </div>

    </section>
  );
};

export default ContactHero;
