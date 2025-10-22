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
async function renderPdf(html, options) {
    const browser = await puppeteer_1.default.launch(buildLaunchOptions());
    try {
        const page = await browser.newPage();
        await page.setContent(html, { waitUntil: "networkidle0" });
        await synchronizeMathJax(page);
        const pdfOptions = (0, config_1.mergePdfOptions)(options);
        const pdf = await page.pdf(pdfOptions);
        return Buffer.isBuffer(pdf) ? pdf : Buffer.from(pdf);
    }
    finally {
        await closeBrowser(browser);
    }
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
