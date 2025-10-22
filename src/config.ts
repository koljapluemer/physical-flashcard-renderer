import { PDFOptions, PDFMargin } from "puppeteer";
import { RenderOptions } from "./types";

export const DEFAULT_PDF_OPTIONS: PDFOptions = {
  format: "A4",
  printBackground: true,
  margin: {
    top: "1cm",
    bottom: "1cm",
    left: "1cm",
    right: "1cm",
  },
};

const DEFAULT_MARGIN: PDFMargin = DEFAULT_PDF_OPTIONS.margin ?? {};

export function mergePdfOptions(custom?: RenderOptions): PDFOptions {
  if (!custom) {
    return {
      ...DEFAULT_PDF_OPTIONS,
      margin: { ...DEFAULT_MARGIN },
    };
  }

  const mergedMargin: PDFMargin | undefined = custom.margin
    ? { ...DEFAULT_MARGIN, ...custom.margin }
    : { ...DEFAULT_MARGIN };

  const { margin, ...rest } = custom;

  return {
    ...DEFAULT_PDF_OPTIONS,
    ...rest,
    margin: mergedMargin,
  };
}
