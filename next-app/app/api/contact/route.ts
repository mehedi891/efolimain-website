import { createTransport } from "nodemailer";

/**
 * Contact form submission — POST /api/contact
 *
 * Ported from the React Router contact `action` (app/routes/contact.jsx):
 * verifies the hCaptcha token, then emails the submission via SMTP. Returns
 * { success, message } which the client Form renders.
 *
 * Runs on the Node.js runtime (default) — nodemailer needs Node APIs, so this
 * must NOT be moved to the Edge runtime.
 */
export async function POST(request: Request) {
  const formData = await request.formData();
  const data = Object.fromEntries(formData) as Record<string, string>;

  const hToken = data?.hCaptchaToken;
  if (!hToken) {
    return Response.json({
      success: false,
      message: "Please verify that you are not a robot.",
    });
  }

  // Verify hCaptcha
  const params = new URLSearchParams();
  params.append("secret", process.env.HCAPTCHA_SECRET_KEY || "");
  params.append("response", hToken);

  try {
    const res = await fetch("https://api.hcaptcha.com/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params,
    });
    const verify = await res.json();
    if (!verify.success) {
      return Response.json({
        success: false,
        message: "Captcha verification failed. Please try again.",
      });
    }
  } catch (error) {
    console.error("hCaptcha verification error:", error);
    return Response.json({
      success: false,
      message: "Please verify that you are not a robot.",
    });
  }

  const mailer = createTransport({
    service: "gmail",
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
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
      text: `
        Name: ${data?.name}
        Company: ${data?.company}
        Email: ${data?.email}
        Service: ${data?.service}
        Message: ${data?.message}
      `,
    });
    if (sendMail?.accepted?.length > 0) {
      return Response.json({
        success: true,
        message: "Form submitted successfully.We will get back to you soon.",
      });
    }
  } catch {
    return Response.json({
      success: false,
      message: "Something went wrong. Please try again later.",
    });
  }

  return Response.json({
    success: true,
    message: "Form submitted successfully.We will get back to you soon.",
  });
}
