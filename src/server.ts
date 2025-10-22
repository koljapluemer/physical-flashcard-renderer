import express, { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import { renderPdf } from "./render";
import { RenderRequestBody } from "./types";

const app = express();

app.use(express.json({ limit: process.env.REQUEST_LIMIT ?? "5mb" }));

app.post("/render", async (req: Request, res: Response, next: NextFunction) => {
  const { html, options } = req.body as RenderRequestBody;

  if (!html || typeof html !== "string") {
    return res.status(400).json({ error: "`html` field is required" });
  }

  try {
    const pdfBuffer = await renderPdf(html, options);

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
