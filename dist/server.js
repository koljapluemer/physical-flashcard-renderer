"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const render_1 = require("./render");
const app = (0, express_1.default)();
exports.app = app;
app.use(express_1.default.json({ limit: process.env.REQUEST_LIMIT ?? "5mb" }));
app.post("/render", async (req, res, next) => {
    const { html, options } = req.body;
    if (!html || typeof html !== "string") {
        return res.status(400).json({ error: "`html` field is required" });
    }
    try {
        const pdfBuffer = await (0, render_1.renderPdf)(html, options);
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
