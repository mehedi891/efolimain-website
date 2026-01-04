import { useNavigation } from "react-router";
//import { ContactEmailTemplate } from "../component/contactpage/contactEmailTemplate/contactEmailTemplate";
import Contactpage from "../component/contactpage/Contactpage";
import { createTransport } from "nodemailer";
import ElegantFloatingText from "../component/Loader/ElegantFloatingText";





export const handle = { darkFooter: true, darkHeader: true };
export function meta() {
  return [
    { title: "Contact eFoli | Let’s Start Your Next Project" },
    { name: "description", content: "Reach out to eFoli for Shopify development, app support, partnerships, or collaborations. Our team responds quickly and is ready to help you move forward." },
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
          ],
          "contactPoint": [
            {
              "@type": "ContactPoint",
              "contactType": "sales",
              "email": "info@efoli.com",
              "telephone": "+8801613333654",
              "areaServed": "Worldwide",
              "availableLanguage": ["en"]
            },
            {
              "@type": "ContactPoint",
              "contactType": "customer support",
              "email": "info@efoli.com",
              "telephone": "+8801613333654",
              "areaServed": "Worldwide",
              "availableLanguage": ["en"]
            }
          ]
        },

        {
          "@type": "ContactPage",
          "@id": "https://efoli.com/contact-us/#contactpage",
          "url": "https://efoli.com/contact-us/",
          "name": "Contact EFOLI",
          "description": "Get in touch with EFOLI for Shopify app support, custom development, API integrations, white-label customer support, and eCommerce solutions.",
          "isPartOf": { "@id": "https://efoli.com/#website" },
          "about": { "@id": "https://efoli.com/#organization" },
          "inLanguage": "en"
        },

        {
          "@type": "BreadcrumbList",
          "@id": "https://efoli.com/contact-us/#breadcrumb",
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
              "name": "Contact Us",
              "item": "https://efoli.com/contact-us/"
            }
          ]
        },

        {
          "@type": "FAQPage",
          "@id": "https://efoli.com/contact-us/#faq",
          "mainEntity": [
            {
              "@type": "Question",
              "name": "Do you only provide services for Shopify?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "We specialize in the Shopify ecosystem, such as apps, themes, and stores, because that’s where our products and experience are strongest. If your project is eCommerce or SaaS-related and connects to Shopify in any way, we’re usually a good fit."
              }
            },
            {
              "@type": "Question",
              "name": "What kind of services does eFoli offer?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "eFoli builds and maintains Shopify apps, develops custom Shopify solutions (apps, themes, store setup, custom features), and provides white-label customer support through KivoSupport for SaaS and Shopify apps."
              }
            },
            {
              "@type": "Question",
              "name": "Who do you typically work with?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "We work with Shopify merchants, SaaS founders, and agencies—from early-stage startups to established brands—who want stable products, thoughtful UX, and long-term technical or support partners."
              }
            },
            {
              "@type": "Question",
              "name": "Can you help with both new projects and existing apps or stores?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Yes. We can start from scratch with a new idea or step into an existing app or store to improve performance, add features, or take over ongoing maintenance and support."
              }
            },
            {
              "@type": "Question",
              "name": "What happens after I submit the contact form?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Our team reviews your message and usually replies within one business day. If there’s a potential fit, we’ll schedule a short call to understand your goals and share next steps or a proposal based on your needs."
              }
            },
            {
              "@type": "Question",
              "name": "Do you work with platforms other than Shopify?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Our core expertise is Shopify and the Shopify App ecosystem. However, if your project involves eCommerce workflows, integrations, or SaaS tools that connect with Shopify, we can evaluate it. If it’s a good fit, we’ll let you know how we can help."
              }
            },
            {
              "@type": "Question",
              "name": "Do you offer ongoing maintenance or long-term partnership plans?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Yes. We support long-term partnerships through continuous development, feature updates, performance optimization, bug fixes, and 24/7 customer support via KivoSupport. Many clients rely on us as their dedicated technical team for sustainable growth."
              }
            },
            {
              "@type": "Question",
              "name": "Can eFoli help integrate third-party apps or custom APIs?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Absolutely. We frequently integrate third-party services, APIs, and external systems into Shopify apps or stores—including payments, analytics, logistics, or custom business tools. We build secure, seamless integrations tailored to your workflow."
              }
            }
          ]
        }
      ]
    }

  ];
}
const Contact = () => {
  const navigation = useNavigation();
  return (navigation.state === "loading" ?
    <div className="h-lvh w-lvw bg-blue-50 flex items-center justify-center">
      <ElegantFloatingText text={"Loading..."} />
    </div>
    :
    <Contactpage />
  )
}

export default Contact

export const action = async ({ request }) => {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);

  // console.log({host:process.env.SMTP_HOST, port:process.env.SMTP_PORT, secure:true, auth:{user:process.env.SMTP_USER, pass:process.env.SMTP_PASS}});


  const hToken = data?.hCaptchaToken;
  if (!hToken) {
    return {
      success: false,
      message: "Please verify that you are not a robot."
    }
  }

  const params = new URLSearchParams();
  params.append("secret", process.env.HCAPTCHA_SECRET_KEY);
  params.append("response", hToken);
 
  
  try {
    const res = await fetch("https://api.hcaptcha.com/siteverify", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params,
    });

    const data = await res.json();
    // console.log('Data:',data);
    if (!data.success) {
      return {
        success: false,
        message: "Captcha verification failed. Please try again."
      };
    }
  } catch (error) {
    console.error("hCaptcha verification error:", error);
    return {
      success: false,
      message: "Please verify that you are not a robot."
    };
  }


  const mailer = createTransport({
    service: "gmail",
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: true,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });



  try {
    const sendMail = await mailer.sendMail({
      from: `${data?.name} <${data?.email}>`,
      to: process.env.SMTP_USER,
      replyTo: data?.email,
      subject: "New Contact Submission from Efoli Website",
      //html:ContactEmailTemplate(data),

      text: `
        Name: ${data?.name}
        Company: ${data?.company}
        Email: ${data?.email}
        Service: ${data?.service}
        Message: ${data?.message}
      `
    });
    console.log('sendEMail:', sendMail);
    if (sendMail?.accepted?.length > 0) {
      return {
        success: true,
        message: "Form submitted successfully.We will get back to you soon."
      }
    }
  } catch (error) {
    return {
      success: false,
      message: "Something went wrong. Please try again later."
    }
  }


  return {
    success: true,
    message: "Form submitted successfully.We will get back to you soon.",
  };
};