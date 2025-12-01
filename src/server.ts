import express, { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import cors, { CorsOptions } from "cors";
import { renderPdf } from "./render";
import { RenderRequestBody } from "./types";

const app = express();

// CORS configuration
const corsOptions = buildCorsOptions();

app.use(cors(corsOptions));
app.use(express.json({ limit: "100mb" }));

app.post("/render", async (req: Request, res: Response, next: NextFunction) => {
  const { pages, headHtml, pageSize } = req.body as RenderRequestBody;

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
    const pdfBuffer = await renderPdf(pages, headHtml, pageSize);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", 'inline; filename="render.pdf"');
    res.setHeader("Content-Length", pdfBuffer.length.toString());

    return res.send(pdfBuffer);
  } catch (error) {
    return next(error);
  }
});

const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  console.error("PDF rendering failed:", err);
  res.status(500).json({ error: "Failed to render PDF" });
};

app.use(errorHandler);

const port = Number.parseInt(process.env.PORT ?? "3000", 10);

app.listen(port, () => {
  console.log(`PDF renderer listening on port ${port}`);
});

export { app };

function buildCorsOptions(): CorsOptions | undefined {
  const origins = process.env.CORS_ALLOWED_ORIGINS
    ?.split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

  if (origins && origins.length > 0) {
    return { origin: origins };
  }

  return undefined;
}
