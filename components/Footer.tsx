import Link from "next/link";
import Image from "next/image";
import Button from "./Button";
import partner from "@/public/footer/partner.png";
import basis from "@/public/footer/basis.png";

// Background images (CSS url()) and the SVG logo stay as plain paths — next/image
// is for raster content images, not CSS backgrounds or vector SVGs.
const footerBg = "/footer/footerBg.webp";
const ctaBg = "/footer/ctaBg.webp";
const logo = "/brand/logo.svg";

interface FooterProps {
  isDark?: boolean;
  isBannerHide?: boolean;
}

const linkClass =
  "transition ease-in duration-200 hover:text-[#0D99FF]";

export default function Footer({ isDark, isBannerHide = false }: FooterProps) {
  return (
    <footer
      style={!isDark ? { backgroundImage: `url(${footerBg})` } : undefined}
      className={`relative ${
        isDark ? " bg-[#010A1E] text-white" : "mt-30 text-[#13181E]"
      } ${isBannerHide && isDark ? "" : "pt-20 mt-10"}`}
    >
      {!isBannerHide && (
        <div
          style={{ backgroundImage: `url(${ctaBg})` }}
          className={`md:py-24 py-10 mx-2 bg-no-repeat bg-cover bg-center max-w-7xl md:mx-auto rounded-2xl ${
            isDark ? "static" : "absolute"
          } top-[-120px] left-0 right-0 px-6`}
        >
          <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-evenly gap-6">
            <div className="max-w-[400px]">
              <h3 className="md:text-6xl font-display font-bold text-white pb-3 hidden md:block">
                Let&apos;s Make <br /> a Real Impact
              </h3>
              <h3 className="text-3xl font-display font-bold text-white pb-3 md:hidden">
                Let&apos;s Make a Real Impact
              </h3>
              <a href="mailto:info@efoli.com" className="text-[18px] text-white">
                info@efoli.com
              </a>
            </div>
            <div className="max-w-[410px]">
              <p className="text-base text-white pb-7">
                Mission to help fast-growing start-ups and creative enterprises to
                achieve their goals faster.
              </p>
              <Link href="/contact-us">
                <Button
                  pClass="px-7 py-3 bg-white text-[#0D99FF] text-lg font-semibold rounded-lg"
                  text1="Let’s Discuss"
                  text2="Let’s Discuss"
                />
              </Link>
            </div>
          </div>
        </div>
      )}

      <div
        className={`max-w-7xl mx-auto ${
          isDark && !isBannerHide
            ? "pt-20"
            : !isDark && !isBannerHide
              ? "md:pt-80 pt-40"
              : "pt-20"
        } pb-10 flex justify-between px-6 gap-10 flex-wrap lg:flex-nowrap items-start`}
      >
        <div className="max-w-lg">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={logo} alt="eFoli" className="max-w-[100px] object-contain" />
          <p className="text-[18px]/[1.7] pt-5 pb-7">
            Crafting B2B eCommerce Solutions, Empowering Success EFOLI is a
            Bangladeshi software company with 15+ years of experience,
            specializing in cutting-edge solutions for eCommerce businesses.
          </p>
          <div className="flex items-center gap-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <Image
              src={partner}
              alt="eFoli"
              className="max-w-[200px] h-[60px] w-auto object-contain"
            />
            <Image
              src={basis}
              alt="eFoli"
              className="max-w-[120px] h-[60px] w-auto object-contain "
            />
          </div>
        </div>

        <div>
          <h3 className="text-xl font-bold font-display mb-5">Company</h3>
          <ul className="text-[18px]/[1.7] ">
            <li className="mb-3">
              <Link className={linkClass} href="/">
                Home
              </Link>
            </li>
            <li className="mb-3">
              <Link className={linkClass} href="/#efProducts">
                Products
              </Link>
            </li>
            <li className="mb-3">
              <Link className={linkClass} href="/service">
                Services
              </Link>
            </li>
            <li className="mb-3">
              <Link className={linkClass} href="/about-us">
                About Us
              </Link>
            </li>
            <li className="mb-3">
              <Link className={linkClass} href="/affiliate">
                Affiliate
              </Link>
            </li>
            <li className="mb-3">
              <Link className={linkClass} href="/contact-us">
                Contact
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-xl font-bold font-display mb-5">Free Tools</h3>
          <ul className="text-[18px]/[1.7] ">
            {[
              ["/free-tools", "All Free Tools"],
              ["/free-tools/shopify-store-audit", "Shopify Store Audit"],
              ["/free-tools/meta-social-preview", "Meta & Social Preview"],
              ["/free-tools/structured-data-checker", "Structured Data Checker"],
              ["/free-tools/ai-visibility-checker", "AI Visibility Checker"],
            ].map(([href, label]) => (
              <li className="mb-3" key={label}>
                <Link className={linkClass} href={href}>
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-xl font-bold font-display mb-5">Products</h3>
          <ul className="text-[18px]/[1.7] ">
            {[
              ["https://multivariants.com", "MultiVariants"],
              ["https://discountray.com", "DiscountRay"],
              ["https://pushbundle.com", "Push Bundle"],
              ["https://embedup.com", "EmbedUp"],
              ["https://kivosupport.com", "Kivo Support"],
              ["https://orderrules.com/", "Order Rules"],
              ["https://www.quotway.com/", "Quotway"],
            ].map(([href, label]) => (
              <li className="mb-3" key={label}>
                <a
                  className={linkClass}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-xl font-bold font-display mb-5">Follow</h3>
          <ul className="text-[18px]/[1.7] ">
            <li className="mb-3">
              <a
                className={linkClass}
                href="https://www.facebook.com/eFoli.llc"
                target="_blank"
                rel="noopener noreferrer"
              >
                Facebook
              </a>
            </li>
            <li className="mb-3">
              <a
                className={linkClass}
                href="https://www.linkedin.com/company/efoli"
                target="_blank"
                rel="noopener noreferrer"
              >
                Linkedin
              </a>
            </li>
            <li className="mb-3">
              <Link className={linkClass} href="/">
                Twitter
              </Link>
            </li>
            <li className="mb-3">
              <Link className={linkClass} href="/">
                Reddit
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pb-5 pt-10 pl-5">
        <p className="text-base">
          ©eFoli 2011 - {new Date().getFullYear()}. All rights reserved
        </p>
      </div>
    </footer>
  );
}
