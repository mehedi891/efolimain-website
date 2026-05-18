import bg_gradient from "./bg_gradient.webp";
import mvIcon from "./mv_icon.png";
import pbIcon from "./pbLogo.png";
import drIcon from "./drLogo.png";
import emIcon from "./emLogo.png";
import pb_demo from "../../../images/pb.webp";
import dr_demo from "../../../images/dr.webp";
import mv_demo from "../../../images/mv_demo.png";
import em_demo from "../../../images/emDemo.webp";
import or_thumb from "../../../images/or_thumb.png";
import or_icon from "../../../images/or_icon.png";
import { Link } from "react-router";
import Button from "../../Button/Button";
import ButtonWithIcon from "../../ButtonWithIcon/ButtonWithIcon";
import AnimatedSection from "../../AnimatedSection/AnimatedSection";

const Innovation = () => {

  return (
    <section style={{ backgroundImage: `url(${bg_gradient})` }} className={`md:py-30 py-10 bg-no-repeat bg-cover bg-center`}>
      <AnimatedSection>
        <div id="efProducts" className="mx-auto max-w-7xl px-4 md:px-0 ">
          <h3 className="text-lg text-center text-blue-500 font-[600]">Products</h3>
          <h2 className="font-display md:text-5xl text-3xl font-bold text-center pt-2 md:mb-20 mb-10">Our Innovative Shopify Apps</h2>

          <div className="mb-7 flex md:flex-wrap flex-wrap-reverse items-center justify-between shadow-lg p-8 rounded-2xl bg-linear-to-r from-[#fff] to-[#f2fbfa] transition ease-in duration-300 hover:scale-105 hover:cursor-pointer hover-drop-shadow-2xl">
            <div className="max-w-[550px]">
              <div className="flex items-center gap-2">
                <img src={mvIcon} alt="Multivariants" className="md:max-w-[42px] max-w-[35px] h-auto" />
                <h4 className="md:text-2xl text-xl text-[#13181E] font-bold font-display">MultiVariants ‑ Bulk Order</h4>
              </div>
              <p className="text-base/[1.75] text-[#4B5154] py-4">Simplify bulk ordering with one click. Apply flexible business rules and watch your sales grow faster with MultiVariants.</p>
              <Link to={"https://multivariants.com"} target="_blank" >
                <ButtonWithIcon text1="Go to product" text2="Go to product" pClass="text-base font-semibold" />
              </Link>




            </div>

            <div className="max-w-[450px]">
              <img className="object-fill h-auto w-auto" src={mv_demo} alt="Multivariants" />
            </div>



          </div>

          <div className="flex flex-wrap gap-7 justify-between">

            <div className=" flex md:flex-wrap flex-wrap-reverse flex-col-reverse gap-4 items-center justify-self-end md:gap-12 shadow-lg p-8 rounded-2xl bg-linear-to-r from-[#fff] to-[#f2fbfa] max-w-full md:max-w-[50%] flex-1
          transition ease-in duration-300 hover:scale-105 hover:cursor-pointer hover-drop-shadow-2xl 
          ">
              <div className="max-w-[550px]">
                <div className="flex items-center gap-2">
                  <img src={pbIcon} alt="Multivariants" className="md:max-w-[42px] max-w-[35px] h-auto rounded-sm" />
                  <h4 className="md:text-2xl text-xl text-[#13181E] font-bold font-display">Push Bundle ‑ Build a Box</h4>
                </div>
                <p className="text-base/[1.75] text-[#4B5154] py-4">Your one-stop bundling solution for Shopify. Build custom product bundles, control pricing rules, and boost your store’s AOV with ease.</p>
                <Link to={"https://pushbundle.com"} target="_blank">
                  <ButtonWithIcon text1="Go to product" text2="Go to product" pClass="text-base font-semibold" />
                </Link>
              </div>


              <img className="max-w-full max-h-[400px]" src={pb_demo} alt="Push Bundle" />


            </div>

            <div className=" flex md:flex-wrap flex-wrap-reverse flex-col-reverse gap-4 items-center justify-self-end md:gap-6 shadow-lg p-8 rounded-2xl bg-linear-to-r from-[#fff] to-[#f2fbfa] max-w-full md:max-w-[50%]
          transition ease-in duration-300 hover:scale-105 hover:cursor-pointer hover-drop-shadow-2xl flex-1
          ">
              <div className="max-w-[550px]">
                <div className="flex items-center gap-2">
                  <img src={drIcon} alt="DiscountRay" className="md:max-w-[42px] max-w-[35px] h-auto" />
                  <h4 className="md:text-2xl text-xl text-[#13181E] font-bold font-display">DiscountRay ‑ B2B Custom Pricing</h4>
                </div>
                <p className="text-base/[1.75] text-[#4B5154]  py-4">Create personalized discounts for every customer segment. Define pricing tiers, create conditions, automate exclusive deals.</p>
                <Link to={"https://discountray.com"} target="_blank">
                  <ButtonWithIcon text1="Go to product" text2="Go to product" pClass="text-base font-semibold" />
                </Link>
              </div>


              <img className="max-w-full max-h-[400px]" src={dr_demo} alt="DiscountRay" />


            </div>

          </div>

          <div className="mt-7 flex md:flex-wrap flex-wrap-reverse items-center justify-between shadow-2xl p-8 rounded-2xl bg-linear-to-r from-[#fff] to-[#f2fbfa]
        transition ease-in duration-300 hover:scale-105 hover:cursor-pointer hover-drop-shadow-2xl
        ">
            <div className="max-w-[550px]">
              <div className="flex items-center gap-2">
                <img src={emIcon} alt="EmbedUp" className="md:max-w-[42px] max-w-[35px] h-auto" />
                <h4 className="md:text-2xl text-xl text-[#13181E] font-bold font-display">Embedup - sell anywherer</h4>
              </div>
              <p className="text-base/[1.75] text-[#4B5154] py-4">Turn any website or blog into a sales channel within minutes. Embed Shopify products seamlessly on WordPress, Wix, Webflow, Squarespace, and more.</p>
              <Link to={"https://embedup.com"} target="_blank" >
                <ButtonWithIcon text1="Go to product" text2="Go to product" pClass="text-base font-semibold" />
              </Link>
            </div>


            <img className="max-w-full max-h-[450px]" loading="lazy" src={em_demo} alt="EmbedUp" />


          </div>

          <div className="mt-7 flex md:flex-wrap flex-wrap-reverse items-center justify-between shadow-2xl p-8 rounded-2xl bg-linear-to-r from-[#fff] to-[#f2fbfa]
        transition ease-in duration-300 hover:scale-105 hover:cursor-pointer hover-drop-shadow-2xl
        ">
            <div className="max-w-[550px]">
              <div className="flex items-center gap-2">
                <img src={or_icon} alt="Order Rules" className="md:max-w-[42px] max-w-[35px] h-auto" />
                <h4 className="md:text-2xl text-xl text-[#13181E] font-bold font-display">OrderRules ‑ Store Open Limits</h4>
              </div>
              <p className="text-base/[1.75] text-[#4B5154] py-4">Manually toggling your store open and closed, canceling orders that exceed capacity, losing track of daily limits. OrderRules automates all of it.</p>
              <Link to={"https://orderrules.com"} target="_blank" >
                <ButtonWithIcon text1="Go to product" text2="Go to product" pClass="text-base font-semibold" />
              </Link>
            </div>


            <img className="max-w-full max-h-[450px]" loading="lazy" src={or_thumb} alt="Order Rules" />


          </div>

        </div>
      </AnimatedSection>

    </section>
  )
}

export default Innovation


// #f2fbfa