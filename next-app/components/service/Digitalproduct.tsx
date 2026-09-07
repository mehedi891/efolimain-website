const circleImg = "/img/service/circle.png";
const circleImg2 = "/img/service/circle2.png";

const Digitalproduct = () => {
  return (
    <section className="md:py-30 py-10 bg-[#0A0C00] text-white relative ">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute right-[-1%] md:top-[-7%] top-[-3%] rotateCircleAbout">
          <img className="object-contain md:max-w-[200px] max-w-25" src={circleImg2} alt="" />
        </div>
        <div className="absolute left-[-2%] bottom-[-7%] rotateCircleAbout md:block hidden">
          <img className="object-contain max-w-[230px]" src={circleImg} alt="" />
        </div>
      </div>
      <div className="max-w-7xl mx-auto">
        <div className="flex items-start gap-10 md:gap-30 md:flex-row flex-col md:px-0 px-4">
          <h2 className="text-3xl md:text-5xl/[1.25] font-bold font-display tracking-[-1.44px] max-w-[380px] md:sticky static top-28 text-center md:text-left">Why Partner with eFoli for Your Digital Product ?</h2>

          <div className="flex-1 flex flex-col md:gap-20 gap-10">
            <div className="flex items-start justify-between w-full gap-2">
              <div className="md:max-w-[332px] max-w-1/2">
                <svg xmlns="http://www.w3.org/2000/svg" className='w-16 h-16 md:mb-10 mb-6' width="64" height="64" viewBox="0 0 64 64" fill="none">
                  <g clipPath="url(#clip0_2938_371)">
                    <path d="M32.0001 29.8344L43.0702 23.4426L32.0001 17.1152L20.9299 23.4426L32.0001 29.8344Z" fill="white" />
                    <path d="M33.875 13.8686L47.3476 21.5686C48.5099 21.8454 48.875 23.1504 48.875 23.5295V39.5778L60.125 46.0728V17C60.125 16.328 59.7643 15.7055 59.1801 15.3722L33.875 0V13.8686Z" fill="white" />
                    <path d="M18.875 26.5874V39.383L30.125 45.8133V33.0832L18.875 26.5874Z" fill="white" />
                    <path d="M46.8301 42.7276C45.4003 43.5423 52.0081 39.7737 32.8461 50.6941C32.5893 50.8262 32.3101 50.9186 32.0011 50.9186C31.6921 50.9186 31.4128 50.8261 31.1561 50.6941C30.777 50.4991 16.796 42.5492 17.1721 42.7276L5.89233 49.2402L31.071 63.753C31.3585 63.9177 31.6807 64.0002 32.0011 64.0002C32.3215 64.0002 32.6438 63.9178 32.9312 63.753L58.1102 49.2399L46.8301 42.7276Z" fill="white" />
                    <path d="M45.125 26.5874L33.875 33.0824V45.8133L45.125 39.383V26.5874Z" fill="white" />
                    <path d="M15.125 39.578V23.5295C15.125 23.4936 15.2584 21.8969 16.653 21.5685L30.125 13.8686V0L4.81987 15.3722C4.23575 15.7055 3.875 16.328 3.875 17V46.0732L15.125 39.578Z" fill="white" />
                  </g>
                  <defs>
                    <clipPath id="clip0_2938_371">
                      <rect width="64" height="64" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
                <h3 className="text-base md:text-2xl/[1.58] font-bold font-display mb-4">User-Centric Foundation</h3>
                <p className="text-sm md:text-xl/[1.6] text-[#9FA5A7]">We build every product around real user needs, focusing on usability, clarity, and performance to create experiences that drive results.</p>
              </div>

              <div className="md:max-w-[332px] max-w-1/2">
                <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" className='w-16 h-16 md:mb-10 mb-6' viewBox="0 0 64 64" fill="none">
                  <path d="M32 17C33.0355 17 33.875 16.1605 33.875 15.125C33.875 14.0895 33.0355 13.25 32 13.25C30.9645 13.25 30.125 14.0895 30.125 15.125C30.125 16.1605 30.9645 17 32 17Z" fill="white" />
                  <path d="M42.6842 22.7734C44.2662 20.5596 45.125 17.8918 45.125 15.125C45.125 7.88863 39.2364 2 32 2C24.7636 2 18.875 7.88863 18.875 15.125C18.875 21.6071 23.5036 26.974 29.7771 28.0669C30.7549 28.2536 31.8243 28.2847 32.8422 28.228L38.0985 37.6872C38.104 37.6809 38.1084 37.6733 38.1139 37.6671C40.6901 34.8089 44.1636 32.8844 47.91 32.2325C47.9182 32.2309 47.9304 32.2319 47.9386 32.2303L42.6842 22.7734ZM32 20.75C28.8982 20.75 26.375 18.2267 26.375 15.125C26.375 12.0233 28.8982 9.5 32 9.5C35.1017 9.5 37.625 12.0233 37.625 15.125C37.625 18.2267 35.1017 20.75 32 20.75Z" fill="white" />
                  <path d="M50.875 50.75C51.9105 50.75 52.75 49.9105 52.75 48.875C52.75 47.8395 51.9105 47 50.875 47C49.8395 47 49 47.8395 49 48.875C49 49.9105 49.8395 50.75 50.875 50.75Z" fill="white" />
                  <path d="M50.8748 35.75C45.9855 35.75 41.2191 38.5449 39.0076 43.25H29.0389C29.0398 43.2525 29.0411 43.2547 29.0421 43.2574C29.6775 45.0444 29.9998 46.9396 29.9998 48.875C29.9998 50.8469 29.6503 52.7358 28.9893 54.5H39.0078C41.1501 59.0355 45.7625 62 50.8749 62C58.1113 62 63.9999 56.1114 63.9999 48.875C63.9999 41.6386 58.1111 35.75 50.8748 35.75ZM50.8748 54.5C47.773 54.5 45.2498 51.9767 45.2498 48.875C45.2498 45.7733 47.773 43.25 50.8748 43.25C53.9765 43.25 56.4998 45.7733 56.4998 48.875C56.4998 51.9767 53.9765 54.5 50.8748 54.5Z" fill="white" />
                  <path d="M13.125 50.75C14.1605 50.75 15 49.9105 15 48.875C15 47.8395 14.1605 47 13.125 47C12.0895 47 11.25 47.8395 11.25 48.875C11.25 49.9105 12.0895 50.75 13.125 50.75Z" fill="white" />
                  <path d="M23.8055 41.2356L29.1909 31.7661C29.1536 31.7592 29.111 31.7579 29.0739 31.7507C25.334 31.0996 21.862 29.1637 19.3482 26.313L13.9672 35.7717C13.689 35.7571 13.407 35.7497 13.125 35.7497C5.88863 35.7497 0 41.6384 0 48.8747C0 56.1111 5.88863 61.9997 13.125 61.9997C20.4945 61.9997 26.25 56.0267 26.25 48.8747C26.25 46.1722 25.4424 43.5362 23.8055 41.2356ZM13.125 54.4997C10.0233 54.4997 7.5 51.9765 7.5 48.8747C7.5 45.773 10.0233 43.2497 13.125 43.2497C16.2267 43.2497 18.75 45.773 18.75 48.8747C18.75 51.9765 16.2267 54.4997 13.125 54.4997Z" fill="white" />
                </svg>
                <h3 className="text-base md:text-2xl/[1.58] font-bold font-display mb-4">Expert Team</h3>
                <p className="text-sm md:text-xl/[1.6] text-[#9FA5A7]">Our developers, designers, and strategists bring years of proven experience in building scalable, high-impact digital products.</p>
              </div>
            </div>
            <div className='border border-[#3F4141]'></div>

            <div className="flex items-start justify-between w-full gap-2">
              <div className="md:max-w-[332px] max-w-1/2">
                <svg className='w-14 h-14 md:mb-10 mb-6' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52" fill="none">
                  <path d="M52 1.1365e-06L52 52L9.78146e-07 0L52 1.1365e-06Z" fill="white" />
                  <path d="M26 26L26 52L0 26L26 26Z" fill="white" />
                </svg>
                <h3 className="text-base md:text-2xl/[1.58] font-bold font-display mb-4">Strategic Innovation</h3>
                <p className="text-sm md:text-xl/[1.6] text-[#9FA5A7]">We blend creativity with data-driven insights, ensuring every project is designed to anticipate trends and sustain long-term growth.</p>
              </div>

              <div className="md:max-w-[332px] max-w-1/2">
                <svg xmlns="http://www.w3.org/2000/svg" className='w-14 h-14 md:mb-10 mb-6' viewBox="0 0 52 52" fill="none">
                  <path d="M26 52C32.8956 52 39.5088 49.2607 44.3848 44.3848C49.2607 39.5088 52 32.8956 52 26C52 19.1044 49.2607 12.4912 44.3848 7.61525C39.5088 2.7393 32.8956 2.40725e-05 26 2.27299e-05L26 26L26 52Z" fill="white" />
                  <path d="M0 52C6.89562 52 13.5088 49.2607 18.3848 44.3848C23.2607 39.5088 26 32.8956 26 26C26 19.1044 23.2607 12.4912 18.3848 7.61522C13.5088 2.73928 6.89563 1.34263e-06 6.19888e-06 0L0 52Z" fill="white" />
                </svg>
                <h3 className="text-base md:text-2xl/[1.58] font-bold font-display mb-4">Transparent Process</h3>
                <p className="text-sm md:text-xl/[1.6] text-[#9FA5A7]">From planning to delivery, we maintain full visibility at every stage, keeping you informed, involved, and confident in the outcome.</p>
              </div>
            </div>

            <div className='border border-[#3F4141]'></div>

            <div className="flex items-start justify-between w-full gap-2">
              <div className="md:max-w-[332px] max-w-1/2">
                <svg xmlns="http://www.w3.org/2000/svg" className='w-16 h-16 md:mb-10 mb-6' width="64" height="64" viewBox="0 0 64 64" fill="none">
                  <g clipPath="url(#clip0_2938_413)">
                    <path d="M31.875 64C14.2987 64 0 49.7012 0 32.125C0 14.5487 14.2987 0 31.875 0C32.9114 0 33.75 0.838625 33.75 1.875V9.375C33.75 10.4114 32.9114 11.25 31.875 11.25C20.5024 11.25 11.25 20.7524 11.25 32.125C11.25 43.4976 20.5024 52.75 31.875 52.75C43.2476 52.75 52.75 43.4976 52.75 32.125C52.75 31.0886 53.5886 30.25 54.625 30.25H62.125C63.1614 30.25 64 31.0886 64 32.125C64 49.7012 49.4512 64 31.875 64Z" fill="white" />
                    <path d="M31.875 49C22.5696 49 15 41.4304 15 32.125C15 22.8196 22.5696 15.25 31.875 15.25C32.9114 15.25 33.75 16.0886 33.75 17.125V30.25H46.875C47.9114 30.25 48.75 31.0886 48.75 32.125C48.75 41.4304 41.1804 49 31.875 49Z" fill="white" />
                    <path d="M62.125 26.25H39.625C38.5886 26.25 37.75 25.4114 37.75 24.375V1.875C37.75 0.838625 38.5886 0 39.625 0C53.065 0 64 10.935 64 24.375C64 25.4114 63.1614 26.25 62.125 26.25Z" fill="white" />
                  </g>
                  <defs>
                    <clipPath id="clip0_2938_413">
                      <rect width="64" height="64" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
                <h3 className="text-base md:text-2xl/[1.58] font-bold font-display mb-4">Budget-friendly plan</h3>
                <p className="text-sm md:text-xl/[1.6] text-[#9FA5A7]">We offer flexible, cost-effective plans designed to scale with your business, delivering premium quality without compromising your budget.</p>
              </div>

              <div className="md:max-w-[332px] max-w-1/2">
                <svg xmlns="http://www.w3.org/2000/svg" className='w-16 h-16 md:mb-10 mb-6' width="64" height="64" viewBox="0 0 64 64" fill="none">
                  <g clipPath="url(#clip0_2938_426)">
                    <path d="M32.0004 39.6933C31.5206 39.6933 31.0409 39.5102 30.6747 39.144L24.8574 33.3266C24.125 32.5942 24.125 31.4076 24.8574 30.6752L30.6747 24.8579C31.4071 24.1255 32.5937 24.1255 33.3261 24.8579L39.1435 30.6752C39.8759 31.4076 39.8759 32.5942 39.1435 33.3266L33.3261 39.144C32.9599 39.5102 32.4801 39.6933 32.0004 39.6933Z" fill="white" />
                    <path d="M24.0481 15.5776C22.0921 13.6233 20.9582 10.9641 20.8095 8.21436L2.1992 26.8246C-0.672592 29.6964 -0.790344 34.441 2.1992 37.4265C5.15949 40.3868 9.89768 40.33 12.8011 37.4265L29.3491 20.8785L24.0481 15.5776Z" fill="white" />
                    <path d="M37.4265 51.1998L20.8785 34.6519L15.5776 39.9528C13.6233 41.9088 10.9641 43.0427 8.21436 43.1915L26.8246 61.8017C29.6964 64.6735 34.441 64.7913 37.4265 61.8017C40.3868 58.8414 40.3299 54.1034 37.4265 51.1998Z" fill="white" />
                    <path d="M61.8019 26.5746C58.9857 23.7565 54.0125 23.7602 51.2 26.5746L34.6519 43.1225L39.9528 48.4235C41.9088 50.3778 43.0427 53.0369 43.1915 55.7867L61.8017 37.1765C64.6736 34.3047 64.7913 29.5602 61.8019 26.5746Z" fill="white" />
                    <path d="M48.4235 24.0481C50.3443 22.1257 53.0373 21.0119 55.8632 20.8858L37.1256 2.11076C34.3131 -0.699899 29.3399 -0.707274 26.5237 2.11076C23.5634 5.07105 23.6202 9.80925 26.5237 12.7127L43.1225 29.349L48.4235 24.0481Z" fill="white" />
                  </g>
                  <defs>
                    <clipPath id="clip0_2938_426">
                      <rect width="64" height="64" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
                <h3 className="text-base md:text-2xl/[1.58] font-bold font-display mb-4">Responsive Agility</h3>
                <p className="text-sm md:text-xl/[1.6] text-[#9FA5A7]">Our teams adapt quickly to changing needs and market shifts, ensuring every project stays on track and ahead of expectations.</p>
              </div>
            </div>

          </div>
        </div>
      </div>


    </section>
  )
}

export default Digitalproduct
