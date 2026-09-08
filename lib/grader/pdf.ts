/**
 * Render report HTML → PDF with headless Chrome.
 *
 * Uses @sparticuz/chromium + puppeteer-core, which is the supported combo on
 * Vercel serverless (the chromium binary ships in the package). Locally there's
 * no bundled binary, so this returns null and the caller degrades gracefully
 * (email sends without the PDF attachment).
 *
 * Dynamic imports keep these heavy deps out of the module graph until a PDF is
 * actually requested.
 */

export async function renderReportPdf(html: string): Promise<Buffer | null> {
  try {
    const puppeteer = await import("puppeteer-core");
    const isServerless = !!process.env.AWS_LAMBDA_FUNCTION_VERSION || !!process.env.VERCEL;

    let launchOptions: Parameters<typeof puppeteer.launch>[0];
    if (isServerless) {
      // Vercel/Lambda: use the bundled chromium binary.
      const chromium = (await import("@sparticuz/chromium")).default;
      const executablePath = await chromium.executablePath();
      if (!executablePath) return null;
      launchOptions = { args: chromium.args, defaultViewport: { width: 1000, height: 1400 }, executablePath, headless: true };
    } else {
      // Local dev: use the system-installed Chrome.
      launchOptions = { channel: "chrome", defaultViewport: { width: 1000, height: 1400 }, headless: true };
    }

    const browser = await puppeteer.launch(launchOptions);
    try {
      const page = await browser.newPage();
      await page.setContent(html, { waitUntil: "load" });
      const pdf = await page.pdf({
        format: "A4",
        printBackground: true,
        margin: { top: "18px", bottom: "18px", left: "16px", right: "16px" },
      });
      return Buffer.from(pdf);
    } finally {
      await browser.close();
    }
  } catch (err) {
    console.error("[store-audit] PDF generation failed:", err);
    return null;
  }
}
