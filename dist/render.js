"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderPdf = renderPdf;
const puppeteer_1 = __importDefault(require("puppeteer"));
const config_1 = require("./config");
const LAUNCH_ARGS = ["--no-sandbox", "--disable-setuid-sandbox"];
function buildLaunchOptions() {
    const base = {
        headless: true,
        args: LAUNCH_ARGS,
    };
    if (process.env.CHROME_EXECUTABLE_PATH) {
        base.executablePath = process.env.CHROME_EXECUTABLE_PATH;
    }
    return base;
}
async function renderPdf(pages, headHtml, pageSize) {
    const browser = await puppeteer_1.default.launch(buildLaunchOptions());
    try {
        const combinedHtml = buildMultiPageHtml(pages, headHtml);
        const page = await browser.newPage();
        await page.setContent(combinedHtml, { waitUntil: "networkidle0" });
        await synchronizeMathJax(page);
        const pdfOptions = (0, config_1.mergePdfOptions)(pageSize);
        const pdf = await page.pdf(pdfOptions);
        return Buffer.isBuffer(pdf) ? pdf : Buffer.from(pdf);
    }
    finally {
        await closeBrowser(browser);
    }
}
function buildMultiPageHtml(pages, headHtml) {
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
async function synchronizeMathJax(page) {
    try {
        await page.waitForFunction(() => {
            const mathJax = globalThis.MathJax;
            return typeof mathJax?.typesetPromise === "function";
        }, { timeout: 3000 });
        await page.evaluate(async () => {
            const mathJax = globalThis.MathJax;
            if (mathJax?.typesetPromise) {
                await mathJax.typesetPromise();
            }
        });
    }
    catch {
        // MathJax not present or failed; continue rendering best-effort.
    }
}
async function closeBrowser(browser) {
    try {
        await browser.close();
    }
    catch {
        // Ignore browser closing errors in shutdown path.
    }
}
