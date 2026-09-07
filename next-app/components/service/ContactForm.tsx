import Form from "@/components/Form";

const ContactForm = () => {
  return (
    <section id="contactus" className="md:py-15 py-10 bg-[#EBEEF0] text-[#13181E] z-20 relative">
      <div className="max-w-7xl mx-auto md:px-0 px-4">
        <div className="flex justify-between md:flex-row flex-col md:gap-0 gap-10">
          <div className="md:max-w-2/6 w-full">
            <h2 className="text-3xl md:text-5xl/[1.25] font-bold font-display tracking-[-1.44px] max-w-[430px]">Have a project idea in mind? Let&apos;s get started.</h2>
            <p className="text-base md:text-xl/[1.6] mt-6">We’ll schedule a quick call to explore your vision. After our discovery session, we’ll share a tailored proposal. Once approved, we’ll begin turning your idea into reality.</p>
          </div>

          <div className="w-full md:w-1/2">
            <Form
            fClass="w-full bg-white p-8 rounded-sm"
            btnClass="bg-[#0D99FF] text-white px-6 py-3.5 font-medium"
            btnTxt='Submit Message'
            />
          </div>

        </div>
      </div>
    </section>
  )
}

export default ContactForm
