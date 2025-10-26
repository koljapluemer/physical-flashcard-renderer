"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const render_1 = require("./render");
const app = (0, express_1.default)();
exports.app = app;
// CORS configuration
const corsOptions = buildCorsOptions();
app.use((0, cors_1.default)(corsOptions));
app.use(express_1.default.json({ limit: process.env.REQUEST_LIMIT ?? "5mb" }));
app.post("/render", async (req, res, next) => {
    const { pages, headHtml, pageSize } = req.body;
    // Validate pages field
    if (!pages) {
        return res.status(400).json({ error: '"pages" field is required' });
    }
    if (!Array.isArray(pages)) {
        return res.status(400).json({ error: '"pages" must be an array' });
    }
    if (pages.length === 0) {
        return res.status(400).json({ error: '"pages" must be a non-empty array' });
    }
    if (!pages.every((page) => typeof page === "string")) {
        return res.status(400).json({ error: 'All elements in "pages" must be strings' });
    }
    // Validate headHtml field
    if (headHtml === undefined) {
        return res.status(400).json({ error: '"headHtml" field is required' });
    }
    if (typeof headHtml !== "string") {
        return res.status(400).json({ error: '"headHtml" must be a string' });
    }
    // Validate pageSize field if provided
    if (pageSize !== undefined) {
        if (!Array.isArray(pageSize) || pageSize.length !== 2) {
            return res.status(400).json({ error: '"pageSize" must be an array of exactly 2 numbers [width, height]' });
        }
        if (!pageSize.every((dim) => typeof dim === "number" && dim > 0)) {
            return res.status(400).json({ error: '"pageSize" values must be positive numbers' });
        }
    }
    try {
        const pdfBuffer = await (0, render_1.renderPdf)(pages, headHtml, pageSize);
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", 'inline; filename="render.pdf"');
        res.setHeader("Content-Length", pdfBuffer.length.toString());
        return res.send(pdfBuffer);
    }
    catch (error) {
        return next(error);
    }
});
const errorHandler = (err, _req, res, _next) => {
    console.error("PDF rendering failed:", err);
    res.status(500).json({ error: "Failed to render PDF" });
};
app.use(errorHandler);
const port = Number.parseInt(process.env.PORT ?? "3000", 10);
app.listen(port, () => {
    console.log(`PDF renderer listening on port ${port}`);
});
function buildCorsOptions() {
    if (process.env.ALLOW_ALL_ORIGINS === "true") {
        return { origin: "*" };
    }
    const origins = process.env.CORS_ALLOWED_ORIGINS
        ?.split(",")
        .map((origin) => origin.trim())
        .filter(Boolean);
    if (origins && origins.length > 0) {
        return { origin: origins };
    }
    return undefined;
}
