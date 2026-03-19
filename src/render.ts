import puppeteer, { Browser, LaunchOptions, Page } from "puppeteer";
import { mergePdfOptions } from "./config";
import { RenderOptions } from "./types";

const LAUNCH_ARGS = ["--no-sandbox", "--disable-setuid-sandbox"];

function buildLaunchOptions(): LaunchOptions {
  const base: LaunchOptions = {
    headless: true,
    args: LAUNCH_ARGS,
  };

  if (process.env.CHROME_EXECUTABLE_PATH) {
    base.executablePath = process.env.CHROME_EXECUTABLE_PATH;
  }

  return base;
}

export async function renderPdf(pages: string[], headHtml: string, pageSize?: [number, number]): Promise<Buffer> {
  const launchOptions = buildLaunchOptions();
  console.log("[render] launching browser, executablePath:", launchOptions.executablePath ?? "(puppeteer default)");
  const browser = await puppeteer.launch(launchOptions);
  console.log("[render] browser launched");

  try {
    const combinedHtml = buildMultiPageHtml(pages, headHtml);
    console.log("[render] combined HTML length:", combinedHtml.length);
    console.log("[render] headHtml:", headHtml.slice(0, 500));

    const page = await browser.newPage();

    page.on("request", (req) => {
      console.log("[render] request:", req.resourceType(), req.url().slice(0, 120));
    });
    page.on("requestfailed", (req) => {
      console.log("[render] request FAILED:", req.url().slice(0, 120), req.failure()?.errorText);
    });
    page.on("console", (msg) => {
      console.log("[render] page console:", msg.type(), msg.text().slice(0, 200));
    });

    console.log("[render] calling setContent (waitUntil: networkidle0)");
    await page.setContent(combinedHtml, { waitUntil: "networkidle0" });
    console.log("[render] setContent done");
    await synchronizeMathJax(page);
    console.log("[render] MathJax sync done");
    const pdfOptions = mergePdfOptions(pageSize);
    const pdf = await page.pdf(pdfOptions);
    return Buffer.isBuffer(pdf) ? pdf : Buffer.from(pdf);
  } finally {
    await closeBrowser(browser);
  }
}

function buildMultiPageHtml(pages: string[], headHtml: string): string {
  const pageStyle = `
    <style>
      .pdf-page {
        page-break-after: always;
        page-break-inside: avoid;
      }
      .pdf-page:last-child {
        page-break-after: auto;
      }
    </style>
  `;

  const wrappedPages = pages.map((pageContent) => {
    return `<div class="pdf-page">${pageContent}</div>`;
  }).join('\n');

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8"/>
  ${headHtml}
  ${pageStyle}
</head>
<body>
  ${wrappedPages}
</body>
</html>`;
}

async function synchronizeMathJax(page: Page): Promise<void> {
  try {
    await page.waitForFunction(
      () => {
        const mathJax = (globalThis as typeof globalThis & MathJaxHost).MathJax;
        return typeof mathJax?.typesetPromise === "function";
      },
      { timeout: 30000 }
    );

    await page.evaluate(async () => {
      const mathJax = (globalThis as typeof globalThis & MathJaxHost).MathJax;
      if (mathJax?.typesetPromise) {
        await mathJax.typesetPromise();
      }
    });
  } catch {
    // MathJax not present or failed; continue rendering best-effort.
  }
}

async function closeBrowser(browser: Browser): Promise<void> {
  try {
    await browser.close();
  } catch {
    // Ignore browser closing errors in shutdown path.
  }
}

type MathJaxHost = {
  MathJax?: {
    typesetPromise?: () => Promise<void>;
  };
};
