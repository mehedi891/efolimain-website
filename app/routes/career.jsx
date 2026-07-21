import { useLoaderData, useNavigation } from "react-router";
import Careerpage from "../component/careerpage/Careerpage"
import ElegantFloatingText from "../component/Loader/ElegantFloatingText";
import { getOpenJobs } from "../data/jobs";

export const loader = async () => {
  // Open positions come from easy.jobs — see app/data/jobs.js
  const jobs = await getOpenJobs();
  return { jobs };
};

export function meta() {
  return [
    { title: "Careers at eFoli | Build Your Future With Us" },
    { name: "description", content: "Join a global team of innovators. Explore roles in development, design, support, and strategy, and grow your career while shaping digital commerce." },
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
          "description": "EFOLI is a software company specializing in Shopify apps and B2B eCommerce solutions for merchants worldwide.",
          "foundingDate": "2010",
          "numberOfEmployees": 50,
          "areaServed": [
            "Worldwide",
            "Bangladesh",
            "North America",
            "Europe"
          ],
          "email": "info@efoli.com",
          "telephone": "+8801613333654",
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
          "@type": "WebSite",
          "@id": "https://efoli.com/#website",
          "url": "https://efoli.com/",
          "name": "EFOLI – B2B eCommerce Solutions to Empower Growth",
          "publisher": {
            "@id": "https://efoli.com/#organization"
          },
          "inLanguage": "en"
        },
        {
          "@type": "WebPage",
          "@id": "https://efoli.com/career/#webpage",
          "url": "https://efoli.com/career/",
          "name": "Build Your Future With EFOLI – Career Opportunities",
          "isPartOf": {
            "@id": "https://efoli.com/#website"
          },
          "about": {
            "@id": "https://efoli.com/#organization"
          },
          "description": "Explore career opportunities at EFOLI. Discover open roles, learn how we work, and find the right position to grow your career with a fast-moving eCommerce product company.",
          "inLanguage": "en"
        },
        {
          "@type": "BreadcrumbList",
          "@id": "https://efoli.com/career/#breadcrumb",
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
              "name": "Career",
              "item": "https://efoli.com/career/"
            }
          ]
        },
        {
          "@type": "ItemList",
          "@id": "https://efoli.com/career/#open-roles",
          "name": "Current Job Openings at EFOLI",
          "itemListElement": [
            {
              "@type": "ListItem",
              "position": 1,
              "item": {
                "@type": "JobPosting",
                "title": "Technical Support Engineer",
                "description": "As a Technical Support Engineer at EFOLI, you will help merchants and partners use our Shopify apps and SaaS products with confidence by troubleshooting issues, answering questions, and providing a smooth support experience.",
                "datePosted": "2025-01-01",
                "validThrough": "2025-12-31",
                "employmentType": "FULL_TIME",
                "hiringOrganization": {
                  "@id": "https://efoli.com/#organization"
                },
                "jobLocation": {
                  "@type": "Place",
                  "address": {
                    "@type": "PostalAddress",
                    "addressLocality": "Dhaka",
                    "addressRegion": "Dhaka",
                    "addressCountry": "BD"
                  }
                },
                "applicantLocationRequirements": {
                  "@type": "Country",
                  "name": "Bangladesh"
                },
                "workHours": "Full-time, roster-based schedule",
                "industry": "Software, eCommerce, SaaS",
                "url": "https://efoli.com/career/",
                "employmentUnit": {
                  "@id": "https://efoli.com/#organization"
                }
              }
            },
            {
              "@type": "ListItem",
              "position": 2,
              "item": {
                "@type": "JobPosting",
                "title": "Shopify Developer",
                "description": "As a Shopify Developer at EFOLI, you will work on building and improving Shopify apps, storefront experiences, and custom features that help merchants scale and grow their online business.",
                "datePosted": "2025-01-01",
                "validThrough": "2025-12-31",
                "employmentType": "FULL_TIME",
                "hiringOrganization": {
                  "@id": "https://efoli.com/#organization"
                },
                "jobLocation": {
                  "@type": "Place",
                  "address": {
                    "@type": "PostalAddress",
                    "addressLocality": "Dhaka",
                    "addressRegion": "Dhaka",
                    "addressCountry": "BD"
                  }
                },
                "applicantLocationRequirements": {
                  "@type": "Country",
                  "name": "Bangladesh"
                },
                "workHours": "Full-time, office-based with potential flexibility depending on the role",
                "industry": "Software, eCommerce, SaaS",
                "url": "https://efoli.com/career/",
                "employmentUnit": {
                  "@id": "https://efoli.com/#organization"
                }
              }
            }
          ]
        },
        {
          "@type": "FAQPage",
          "@id": "https://efoli.com/career/#faq",
          "mainEntity": [
            {
              "@type": "Question",
              "name": "What kind of roles does EFOLI hire for?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "EFOLI hires across multiple teams, including development, product design, quality assurance, marketing, customer success, and technical support. We look for people who are curious, collaborative, and excited to solve real problems for eCommerce businesses."
              }
            },
            {
              "@type": "Question",
              "name": "Does EFOLI offer remote or hybrid work opportunities?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Some roles at EFOLI may offer hybrid or flexible work arrangements, depending on the position and team needs. Details about working hours and work mode are shared in each job description, and you can always ask for clarification during the hiring process."
              }
            },
            {
              "@type": "Question",
              "name": "How can I partner or collaborate with EFOLI?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "If you are interested in partnering or collaborating with EFOLI as an agency, app partner, or technology provider, you can reach out to us via the contact form on our website or email us at info@efoli.com with a short overview of your proposal."
              }
            },
            {
              "@type": "Question",
              "name": "What type of companies does EFOLI typically work with?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "EFOLI primarily works with Shopify merchants, eCommerce brands, SaaS companies, and digital businesses that want to improve their online operations using scalable apps and custom solutions."
              }
            },
            {
              "@type": "Question",
              "name": "Why should I join or collaborate with EFOLI?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "At EFOLI, you get to work on real products used by global merchants, learn from a collaborative team, and grow your skills in Shopify, SaaS, and B2B eCommerce. Whether you join as a team member or partner, you will be part of a company that focuses on long-term impact, innovation, and merchant success."
              }
            },
            {
              "@type": "Question",
              "name": "How do I apply for a job at EFOLI?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "To apply for a role at EFOLI, visit the career page, review the open positions, and click on the Apply button for the role that fits you best. Follow the instructions in the application form and submit your details. Our team will review your application and contact you if you are shortlisted."
              }
            },
            {
              "@type": "Question",
              "name": "What skills or qualities do you look for in candidates?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "We look for people who take initiative, communicate clearly, and care about building things that make an impact. Whether you’re technical or creative, we value a growth mindset, attention to detail, and a collaborative spirit."
              }
            },
            {
              "@type": "Question",
              "name": "Does eFoli provide opportunities for learning and career growth?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Yes. We invest in long-term growth through mentorship, cross-team collaboration, and real project exposure. Our team members gain hands-on experience with global SaaS products and the latest eCommerce technologies."
              }
            },
            {
              "@type": "Question",
              "name": "What’s the recruitment process like at eFoli?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "After you apply, our team reviews your profile and reaches out if there’s a fit. The process usually includes a written exam, a technical or skill-based task, and a final interview to ensure alignment with our values and goals."
              }
            }
          ]
        }
      ]
    }

  ];
}
export const handle = { darkFooter: true };

const Career = () => {
  const navigation = useNavigation();
  const { jobs } = useLoaderData();
  return (navigation.state === "loading" ?
    <div className="h-lvh w-lvw bg-blue-50 flex items-center justify-center">
      <ElegantFloatingText text={"Loading..."} />
    </div>
    :
    <Careerpage jobs={jobs} />
  )
}

export default Career