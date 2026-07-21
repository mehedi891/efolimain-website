import footerBg from "./footerBg.webp";
import ctaBg from "./ctaBg.webp";
import logo from "./logo.svg";
import partner from "./partner.png";
import basis from "./basis.png";
import { Link } from "react-router";
import Button from "../Button/Button";


const Footer = ({ isDark, isBannerHide = false }) => {
  return (
    <footer style={!isDark ? { backgroundImage: `url(${footerBg})` } : undefined} className={`relative ${isDark ? ' bg-[#010A1E] text-white' : 'mt-30 text-[#13181E]'} ${isBannerHide && isDark ? '' : 'pt-20 mt-10'}`}>
      {!isBannerHide &&
        <div style={{ backgroundImage: `url(${ctaBg})` }} className={`md:py-24 py-10 mx-2 bg-no-repeat bg-cover bg-center max-w-7xl md:mx-auto rounded-2xl ${isDark ? 'static' : 'absolute'} top-[-120px] left-0 right-0 px-6`}>
          <div className="max-w-6xl mx-auto flex flex-wrap  items-center justify-evenly gap-6">
            <div className="max-w-[400px]">
              <h3 className="md:text-6xl font-display font-bold text-white pb-3 hidden md:block">Let's Make <br /> a Real Impact</h3>
              <h3 className="text-3xl font-display font-bold text-white pb-3 md:hidden">Let's Make a Real Impact</h3>

              <a href="mailto:info@efoli.com" className="text-[18px] text-white">info@efoli.com</a>
            </div>
            <div className="max-w-[410px]">
              <p className="text-base text-white pb-7">Mission to help fast-growing start-ups and creative enterprises to achieve their goals faster.</p>
              <Link
                to="/contact-us"
              >
                <Button
                  pClass="px-7 py-3 bg-white text-[#0D99FF] text-lg font-semibold rounded-lg"
                  text1="Let’s Discuss"
                  text2="Let’s Discuss"
                />
              </Link>

            </div>
          </div>
        </div>
      }

      <div className={`max-w-7xl mx-auto ${isDark && !isBannerHide ? 'pt-20' : !isDark && !isBannerHide ? 'md:pt-80 pt-40' : 'pt-20'} pb-10 flex justify-between px-6 gap-10 flex-wrap lg:flex-nowrap items-start`}>
        <div className="max-w-lg">
          <img src={logo} alt="eFoli" className="max-w-[100px] object-contain" />
          <p className="text-[18px]/[1.7]  pt-5 pb-7">Crafting B2B eCommerce Solutions, Empowering Success EFOLI is a Bangladeshi software company with 15+ years of experience, specializing in cutting-edge solutions for eCommerce businesses.</p>
          <div className="flex items-center gap-4">
            <img src={partner} alt="eFoli" className="max-w-[200px] h-[60px] object-contain" />
            <img src={basis} alt="eFoli" className="max-w-[120px] h-[60px] object-contain " />
          </div>
        </div>

        <div>
          <h3 className="text-xl font-bold font-display mb-5">Company</h3>
          <ul className="text-[18px]/[1.7] ">
            <li className="mb-3"><Link className="transition ease-in duration-200 hover:text-[#0D99FF]" to="/">Home</Link></li>
            <li className="mb-3"><Link className="transition ease-in duration-200 hover:text-[#0D99FF]" to="/#efProducts">Products</Link></li>
            <li className="mb-3"><Link className="transition ease-in duration-200 hover:text-[#0D99FF]" to="/service">Services</Link></li>
            <li className="mb-3"><Link className="transition ease-in duration-200 hover:text-[#0D99FF]" to="/about-us">About Us</Link></li>
            <li className="mb-3"><Link className="transition ease-in duration-200 hover:text-[#0D99FF]" to="/contact-us">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-xl font-bold font-display mb-5">Products</h3>
          <ul className="text-[18px]/[1.7] ">
            <li className="mb-3"><Link className="transition ease-in duration-200 hover:text-[#0D99FF]" to="https://multivariants.com" target="_blak">MultiVariants</Link></li>
            <li className="mb-3"><Link className="transition ease-in duration-200 hover:text-[#0D99FF]" to="https://discountray.com" target="_blak">DiscountRay</Link></li>
            <li className="mb-3"><Link className="transition ease-in duration-200 hover:text-[#0D99FF]" to="https://pushbundle.com" target="_blak">Push Bundle</Link></li>
            <li className="mb-3"><Link className="transition ease-in duration-200 hover:text-[#0D99FF]" to="https://embedup.com" target="_blak">EmbedUp</Link></li>
            <li className="mb-3"><Link className="transition ease-in duration-200 hover:text-[#0D99FF]" to="https://kivosupport.com" target="_blak">Kivo Support</Link></li>
            <li className="mb-3"><Link className="transition ease-in duration-200 hover:text-[#0D99FF]" to="https://orderrules.com/" target="_blak">Order Rules</Link></li>
            <li className="mb-3"><Link className="transition ease-in duration-200 hover:text-[#0D99FF]" to="https://www.quotway.com/" target="_blak">Quotway</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-xl font-bold font-display mb-5">Follow</h3>
          <ul className="text-[18px]/[1.7] ">
            <li className="mb-3"><Link className="transition ease-in duration-200 hover:text-[#0D99FF]" to="https://www.facebook.com/eFoli.llc" target="_blak">Facebook</Link></li>
            <li className="mb-3"><Link className="transition ease-in duration-200 hover:text-[#0D99FF]" to="https://www.linkedin.com/company/efoli" target="_blak">Linkedin</Link></li>
            <li className="mb-3"><Link className="transition ease-in duration-200 hover:text-[#0D99FF]" to="/" target="_blak">Twitter</Link></li>
            <li className="mb-3"><Link className="transition ease-in duration-200 hover:text-[#0D99FF]" to="/" target="_blak">Reddit</Link></li>
          </ul>
        </div>

      </div>

      <div className="max-w-7xl mx-auto pb-5 pt-10 pl-5">
        <p className="text-base">©eFoli 2011 - 2025. All rights reserved</p>
      </div>

    </footer>
  )
}

export default Footer