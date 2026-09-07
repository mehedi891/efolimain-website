import Link from "next/link";
import SiteChrome from "@/components/SiteChrome";

// Ported from routes/404.jsx — shown for any unmatched route.
export default function NotFound() {
  return (
    <SiteChrome>
      <section className="my-10 pb-30">
        <div className="max-w-7xl mx-auto boxShadow px-10 w-full flex items-center flex-col justify-center py-20 rounded-xl bg-[#00543A]">
          <img
            src="https://i.ibb.co/LvLq6d3/Group-29.png"
            alt="illustration"
            className="w-full lg:w-[400px]"
          />
          <p className="text-[#fff] text-[1.2rem] w-full lg:w-[55%] text-center">
            Oops it seems you follow backlink
          </p>

          <Link
            href="/"
            className="py-3 px-6 sm:px-8 rounded-full bg-[#fff] text-black mt-4 flex items-center gap-[10px]"
          >
            Back to home
          </Link>
        </div>
      </section>
    </SiteChrome>
  );
}
