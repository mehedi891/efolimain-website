import { Outlet, useLoaderData, useMatches } from "react-router"
import Navbar from "../component/Navbar/Navbar"
import Footer from "../component/Footer/Footer"
import { isPreviewRequest } from "../utils/preview.server"

export const loader = async ({ request }) => {
  return { isPreview: await isPreviewRequest(request) };
};

const Layout = () => {
  const { isPreview } = useLoaderData();
  const matches = useMatches();
  const darkFooter = matches.some(m => m.handle?.darkFooter === true);
  const darkHeader = matches.some(m => m.handle?.darkHeader === true);
  const isBannerHide = matches.some(m => m.handle?.isBannerHide === true);
  const isHeaderBgTransparent = matches.some(m => m.handle?.isHeaderBgTransparent === true);
  return (
    <div>
      {isPreview && (
        <div className="sticky top-0 z-[100] flex items-center justify-center gap-3 bg-[#b45309] px-4 py-2 text-center text-sm font-medium text-white">
          <span>Preview mode — showing unpublished content.</span>
          <a href="/api/preview/exit" className="font-semibold underline underline-offset-2 hover:opacity-90">
            Exit
          </a>
        </div>
      )}
      <Navbar
        parentClassName={
          darkHeader
            ? "bg-[#0A0C00]"
            : "bg-white/90 backdrop-blur border-b border-gray-100"
        }
        linkClassName={
          darkHeader
            ? "text-white"
            : "text-[#4b5154]"
        }
        isDark={darkHeader}
        isHeaderBgTransparent={isHeaderBgTransparent}
      />
      <Outlet />
      <Footer
        isDark={darkFooter}
        isBannerHide={isBannerHide }

      />
    </div>
  )
}

export default Layout