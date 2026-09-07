import Image from "next/image";
import startImg from "@/public/img/home/starIcon.svg";
import shopifyImg from "@/public/img/home/shopifyImg.png";
const blurImg = "/img/home/blur.webp";
import { motion } from "motion/react";
import Button from "@/components/Button";
import AnimatedSection from "@/components/AnimatedSection";

interface Review {
  name: string;
  rating: number;
  id: number;
  review: string;
}

const CustomerSuccess = () => {

  const reviewsArr: Review[] = [
    {
      name: "QuickClips",
      rating: 5,
      id: 1,
      review: `Day 1 and I am thrilled to find an app that has exactly what I am hoping for! The customer service and tech team has been extremely responsive and I am looking forward to using this app more!
      Week 1 and I am still extremely happy with how responsive and thorough their customer service team is. That is truly something that makes or breaks an app for me. I have appreciated their customization work to make their integration look seamless with our branding! They also seem to be continuing working on their app to have more features which is exciting! Would definitely recommend!`,
    },
    {
      name: "Sessori",
      rating: 5,
      id: 2,
      review: `I've been using this app for almost a year now, and I'm truly satisfied with it. I started with the free version, and now I have a paid subscription which I believe is well worth the money. Sometimes when using various apps, they may conflict with each other or certain features might not work as expected. But I haven't encountered any major issues like that with this app. Also whenever I need custom support, they always respond quickly and do their best to help. Thank you!`,
    },
    {
      name: "Almonte Studio",
      rating: 5,
      id: 3,
      review: `I just downloaded this app for my online shop to help facilitate wholesale ordering through my shopify and this app is exactly what I needed to create an easy experience for my retailers. Not to mention the customer service and live chat feature was extremely helpful in implementing what I needed and have a guided direction of how to get what I wanted done properly. It's really hard to learn whole new apps whenever trying something new on shopify but they made the process very easy.`,
    },
    {
      name: "Blank Print Media",
      rating: 5,
      id: 4,
      review: `This App is amazing, this has increased my coververions by allowing me to have less producting and clearer variants with in a product, worth every cent. Pay for the permium version and get custom coding and support so your app is unique. Amazing. Mehedi's support is 10/10 Well done to your team!`,
    },
    {
      name: "Mama Vann's Beef Jerky",
      rating: 5,
      id: 5,
      review: `Perfect solution to creating variants with multiple sizes and price points. We've been using this app for over 5 years and the customer service is absolutely top notch. If you're considering this solution, I cannot recommend it enough.`,
    },
    {
      name: "Rena's Bread",
      rating: 5,
      id: 6,
      review: `I've been using Multivariants - Bulk Order for about 4 years. Its an excellent product and most importantly, there is a live 24/7 chat on their support page. I get near-instant support if there is ever an issue. Very professional and a breath of fresh air.
      I highly recommend this app.`,
    },
    {
      name: "CANTEENZ",
      rating: 5,
      id: 7,
      review: `MultiVariants was a game changer for our website. It's the ONLY app out there that will let your customers build a FULL CASE of products using numerous different colors or variants. Other apps may allow various colors/variants, but if you need to sell in FULL CASES ONLY, that needs to be a requirement at checkout so your customers don't buy in odd quantities. MultiVariant was there to save the day and we're so greatful.
      Very easy to use and the support is great too. Thanks!`,
    },
     {
      name: "ChoKoLids",
      rating: 5,
      id: 8,
      review: `The support team was incredibly helpful and responsive, addressing all of my questions and concerns promptly. Setting up the app was a breeze, thanks to the clear and intuitive instructions provided. Additionally, the app boasts a wide range of features that cater to various needs esp. for bulk orders, making it a versatile tool. Overall, my experience has been overwhelmingly positive, and I highly recommend this app to anyone looking for a reliable and feature-rich solution.`,
    },
     {
      name: "The Faux Flower Company Trade",
      rating: 5,
      id: 9,
      review: `Great app with an easy interface and reasonable pricing. The best feature of all is the customer service that they offer. I had some requests for how the app shows in my store, as well as some questions and the service i received has been truly outstanding.
Really simple to understand, extremely fast and so useful.
Thank You!`,
    },
     {
      name: "BERNINA of Naperville",
      rating: 5,
      id: 10,
      review: `We started using this app for selling fractional quantities for fabric, and it's solved a major headache we've had since we opened our store back in 2019. It would be great if Shopify were to support fractional quantities natively, but this gets us close enough. The setup was a little confusing, but the support was truly amazing. I used the online chat to get my questions answered and they were terrific. Timely and very helpful for getting us set up and running. Don't hesitate to reach out if you have questions, they are extremely helpful and friendly.`,
    },
  ];

  return (
    <section className="bg-[#F9FAFB] md:py-30 py-10 relative">
      <AnimatedSection>
        <div className="mx-auto max-w-7xl md:px-0 px-4">
          <h3 className="text-lg text-center text-blue-500 font-[600]">Testimonials</h3>
          <h2 className="font-display text-3xl md:text-5xl/[1.1] font-bold text-center line md:mb-15 mb-10 mt-2">Stories of Success</h2>

          {/* <div className="grid grid-cols-3 gap-6">
          <div className="space-y-3 py-7 px-6 bg-white rounded-xl max-h-max">
            <div className="flex items-center gap-2">
              {[startImg, startImg, startImg, startImg, startImg].map((imgsrc, i) => <img
                key={i}
                src={imgsrc}
                alt="Star"
                width={'24px'}
                height={'24px'}
              />)
              }
            </div>
            <p className="text-base">Phenomenal App and Phenomenal Team. It is very rare to come across developers that have built a very solid app and are willing to assist with even the smallest of tasks. Everything that EFOLI has done to help us launch our website with the functionality has been appreciated.</p>
            <div>
              <h5 className="text-xl font-display font-bold">Jessica Lane</h5>
              <p className="text-sm">Marketing Manager</p>
            </div>
          </div>

          <div className="space-y-3 py-7 px-6 bg-white rounded-xl max-h-max">
            <div className="flex items-center gap-2">
              {[startImg, startImg, startImg, startImg, startImg].map((imgsrc, i) => <img
                key={i}
                src={imgsrc}
                alt="Star"
                width={'24px'}
                height={'24px'}
              />)
              }
            </div>
            <p className="text-base">I just downloaded this app for my online shop to help facilitate wholesale ordering through my shopify and this app is exactly what I needed to create an easy experience for my retailers. Not to mention the customer service and live chat feature was extremely helpful in implementing what I needed and have a guided direction of how to get what I wanted done properly. It's really hard to learn whole new apps whenever trying something new on shopify but they made the process very easy.</p>
            <div>
              <h5 className="text-xl font-display font-bold">Jessica Lane</h5>
              <p className="text-sm">Marketing Manager</p>
            </div>
          </div>

          <div className="space-y-3 py-7 px-6 bg-white rounded-xl max-h-max">
            <div className="flex items-center gap-2">
              {[startImg, startImg, startImg, startImg, startImg].map((imgsrc, i) => <img
                key={i}
                src={imgsrc}
                alt="Star"
                width={'24px'}
                height={'24px'}
              />)
              }
            </div>
            <p className="text-base">Phenomenal App and Phenomenal Team. It is very rare to come across developers that have built a very solid app and are willing to assist with even the smallest of tasks. Everything that EFOLI has done to help us launch our website with the functionality has been appreciated.</p>
            <div>
              <h5 className="text-xl font-display font-bold">Jessica Lane</h5>
              <p className="text-sm">Marketing Manager</p>
            </div>
          </div>

          <div className="space-y-3 py-7 px-6 bg-white rounded-xl transform-y-2">
            <div className="flex items-center gap-2">
              {[startImg, startImg, startImg, startImg, startImg].map((imgsrc, i) => <img
                key={i}
                src={imgsrc}
                alt="Star"
                width={'24px'}
                height={'24px'}
              />)
              }
            </div>
            <p className="text-base">Phenomenal App and Phenomenal Team. It is very rare to come across developers that have built a very solid app and are willing to assist with even the smallest of tasks. Everything that EFOLI has done to help us launch our website with the functionality has been appreciated.</p>
            <div>
              <h5 className="text-xl font-display font-bold">Jessica Lane</h5>
              <p className="text-sm">Marketing Manager</p>
            </div>
          </div>

          <div className="space-y-3 py-7 px-6 bg-white rounded-xl">
            <div className="flex items-center gap-2">
              {[startImg, startImg, startImg, startImg, startImg].map((imgsrc, i) => <img
                key={i}
                src={imgsrc}
                alt="Star"
                width={'24px'}
                height={'24px'}
              />)
              }
            </div>
            <p className="text-base">Phenomenal App and Phenomenal Team. It is very rare to come across developers that have built a very solid app and are willing to assist with even the smallest of tasks. Everything that EFOLI has done to help us launch our website with the functionality has been appreciated.</p>
            <div>
              <h5 className="text-xl font-display font-bold">Jessica Lane</h5>
              <p className="text-sm">Marketing Manager</p>
            </div>
          </div>

          <div className="space-y-3 py-7 px-6 bg-white rounded-xl">
            <div className="flex items-center gap-2">
              {[startImg, startImg, startImg, startImg, startImg].map((imgsrc, i) => <img
                key={i}
                src={imgsrc}
                alt="Star"
                width={'24px'}
                height={'24px'}
              />)
              }
            </div>
            <p className="text-base">Phenomenal App and Phenomenal Team. It is very rare to come across developers that have built a very solid app and are willing to assist with even the smallest of tasks. Everything that EFOLI has done to help us launch our website with the functionality has been appreciated.</p>
            <div>
              <h5 className="text-xl font-display font-bold">Jessica Lane</h5>
              <p className="text-sm">Marketing Manager</p>
            </div>
          </div>


        </div> */}



          <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 [column-fill:balance]">

            {reviewsArr.map((review, index) =>
            (
              <div key={index} className="mb-6 break-inside-avoid rounded-xl bg-white px-6 py-7">
                <div className="flex items-center gap-4 mb-3.5">
                  <div className="rounded-full w-[50px] h-[50px] border border-[#e5e5e5] flex items-center justify-center">
                    <Image src={shopifyImg} className="w-6 h-auto" alt="Shopify" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <h5 className="text-base font-display font-semibold text-[#13181E]">{review.name}</h5>
                    <div className="flex items-center gap-2">
                      {[startImg, startImg, startImg, startImg, startImg].map((imgsrc, i) => <Image
                        key={i}
                        src={imgsrc}
                        alt="Star"
                        width={16}
                        height={16}
                      />)
                      }
                    </div>
                  </div>
                </div>

                <p className={`text-base/[1.75] text-[#4B5154]`}>{review.review}</p>

              </div>
            )

            )

            }



          </div>

        </div>

        <div
          // bg-[linear-gradient(180deg,#0F172A00_0%,#0F172A33_25%,#0F172A1F_55%,#FFFFFFB3_85%,#FFFFFFFF_100%)]
          style={{ backgroundImage: `linear-gradient(223deg, rgba(249, 250, 251, 0.10) -19.9%, rgba(249, 250, 251, 0.50) 58.82%)` }}
          className="flex justify-center items-center absolute w-full
             object-cover
            bottom-[0px] h-[45vh]">


          <a
            href="https://apps.shopify.com/multivariants/reviews?sort_by=newest"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button
              pClass="rounded-lg bg-white px-6 py-3.5 font-semibold text-[#13181E] shadow-2xl"
              text1="Meet our customers"
              text2="Meet our customers"
            />
          </a>
        </div>
      </AnimatedSection>
    </section>
  )
}

export default CustomerSuccess
