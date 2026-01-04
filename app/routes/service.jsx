import { useNavigation } from "react-router";
import Servicepage from "../component/servicepage/Servicepage"
import ElegantFloatingText from "../component/Loader/ElegantFloatingText";




export const handle = { darkFooter: true, darkHeader: true, isBannerHide: true };


export function meta() {
  return [
    { title: "Shopify App Development & Support Services | eFoli" },
    { name: "description", content: "From Shopify app development to white-label support, we deliver end-to-end solutions that help businesses launch faster, perform better, and scale globally." },
    {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "Organization",
          "@id": "https://efoli.com/#organization",
          "name": "EFOLI",
          "url": "https://efoli.com/",
          "logo": {
            "@type": "ImageObject",
            "url": "https://efoli.com/assets/logo-qfFYDzw2.svg"
          },
          "description": "EFOLI is a software company specializing in Shopify apps, SaaS products, and full-stack B2B eCommerce solutions.",
          "foundingDate": "2010",
          "numberOfEmployees": 50,
          "email": "info@efoli.com",
          "telephone": "+8801613333654",
          "areaServed": ["Worldwide"],
          "address": {
            "@type": "PostalAddress",
            "streetAddress": "House 514, Road 7, Avenue 4, DOHS Mirpur",
            "addressLocality": "Dhaka",
            "postalCode": "1216",
            "addressCountry": "BD"
          },
          "sameAs": [
            "https://www.facebook.com/eFoli.llc",
            "https://www.linkedin.com/company/efoli"
          ]
        },

        {
          "@type": "WebPage",
          "@id": "https://efoli.com/service/#webpage",
          "url": "https://efoli.com/service/",
          "name": "EFOLI Services – Shopify, SaaS, and Custom Development Solutions",
          "description": "Explore EFOLI’s full-service solutions including Shopify app development, theme customization, store setup, product page optimization, API integrations, and long-term technical support.",
          "isPartOf": { "@id": "https://efoli.com/#website" },
          "about": { "@id": "https://efoli.com/#organization" },
          "inLanguage": "en"
        },

        {
          "@type": "BreadcrumbList",
          "@id": "https://efoli.com/service/#breadcrumb",
          "itemListElement": [
            {
              "@type": "ListItem",
              "position": 1,
              "name": "Home",
              "item": "https://efoli.com/"
            },
            {
              "@type": "ListItem",
              "position": 2,
              "name": "Service",
              "item": "https://efoli.com/service/"
            }
          ]
        },

        {
          "@type": "ItemList",
          "@id": "https://efoli.com/service/#services",
          "name": "EFOLI Services",
          "itemListElement": [
            {
              "@type": "ListItem",
              "position": 1,
              "item": {
                "@type": "Service",
                "name": "Shopify App Development",
                "description": "Custom Shopify app development including embedded apps, admin extensions, storefront APIs, OAuth setup, and full app lifecycle support."
              }
            },
            {
              "@type": "ListItem",
              "position": 2,
              "item": {
                "@type": "Service",
                "name": "Shopify Theme Customization",
                "description": "Pixel-perfect theme customization, Dawn theme optimization, UX improvements, and Liquid/JS-based enhancements for Shopify merchants."
              }
            },
            {
              "@type": "ListItem",
              "position": 3,
              "item": {
                "@type": "Service",
                "name": "Shopify Store Setup",
                "description": "Complete Shopify store setup including products, collections, homepage sections, apps setup, menu structure, and performance optimization."
              }
            },
            {
              "@type": "ListItem",
              "position": 4,
              "item": {
                "@type": "Service",
                "name": "Shopify Product Page Optimization",
                "description": "Custom product page logic, variant logic, bundle integrations, upsell features, and optimized UI for higher conversion rates."
              }
            },
            {
              "@type": "ListItem",
              "position": 5,
              "item": {
                "@type": "Service",
                "name": "API Development & Integration",
                "description": "Custom REST/GraphQL API integrations, data sync, ERP connections, and third-party service integrations for scalable businesses."
              }
            },
            {
              "@type": "ListItem",
              "position": 6,
              "item": {
                "@type": "Service",
                "name": "Custom Script Development",
                "description": "Tailored JavaScript, Liquid, and automation scripts to solve advanced business logic requirements for Shopify stores."
              }
            },
            {
              "@type": "ListItem",
              "position": 7,
              "item": {
                "@type": "Service",
                "name": "Long-Term Technical Support",
                "description": "Ongoing maintenance, feature updates, troubleshooting, and expert advisory for your Shopify store or SaaS product."
              }
            }
          ]
        }

        // {
        //   "@type": "FAQPage",
        //   "@id": "https://efoli.com/service/#faq",
        //   "mainEntity": [
        //     {
        //       "@type": "Question",
        //       "name": "What services does EFOLI offer?",
        //       "acceptedAnswer": {
        //         "@type": "Answer",
        //         "text": "EFOLI provides Shopify app development, theme customization, store setup, product page optimization, API integration, custom scripting, and long-term technical support for merchants and SaaS businesses."
        //       }
        //     },
        //     {
        //       "@type": "Question",
        //       "name": "Do you provide custom Shopify development?",
        //       "acceptedAnswer": {
        //         "@type": "Answer",
        //         "text": "Yes. EFOLI builds fully customized Shopify features — including product logic, variant rules, bundles, discount automation, checkout behavior (where allowed), and merchant-specific app extensions."
        //       }
        //     },
        //     {
        //       "@type": "Question",
        //       "name": "Can EFOLI help with Shopify store migration?",
        //       "acceptedAnswer": {
        //         "@type": "Answer",
        //         "text": "Yes, EFOLI assists with store migration from WooCommerce, Magento, custom platforms, and older Shopify setups while preserving SEO and customer data."
        //       }
        //     },
        //     {
        //       "@type": "Question",
        //       "name": "Do you work with agencies or external partners?",
        //       "acceptedAnswer": {
        //         "@type": "Answer",
        //         "text": "EFOLI collaborates with Shopify agencies, app developers, and SaaS companies for co-development, white-label solutions, and technical backend support."
        //       }
        //     },
        //     {
        //       "@type": "Question",
        //       "name": "How do I request a custom project?",
        //       "acceptedAnswer": {
        //         "@type": "Answer",
        //         "text": "You can request a project through the EFOLI contact form or by emailing info@efoli.com with your requirements. The team will review and get back with a timeline and estimate."
        //       }
        //     }
        //   ]
        // }
      ]
    }

  ];
}

const Service = () => {
  const navigation = useNavigation();
  return (navigation.state === "loading" ?
    <div className="h-lvh w-lvw bg-blue-50 flex items-center justify-center">
      <ElegantFloatingText text={"Loading..."} />
    </div>
    :
    <Servicepage />

  )
}

export default Service