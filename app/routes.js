import { index, layout, route } from "@react-router/dev/routes";

export default [
  route("sitemap.xml", "routes/sitemap[.xml].jsx"),
  layout("layouts/layout.jsx", [
    index("routes/home.jsx"),
    route("about-us/", "routes/about.jsx"),
    route("career/", "routes/career.jsx"),
    route("contact-us/", "routes/contact.jsx"),
    route("service/", "routes/service.jsx"),
    route("offer/", "routes/offer.jsx"),
    route("*", "routes/404.jsx"),
    // route("contact", "routes/contact.jsx"),
  ]),


];



