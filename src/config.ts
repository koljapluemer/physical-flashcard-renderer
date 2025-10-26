import { PDFOptions } from "puppeteer";

export const DEFAULT_PDF_OPTIONS: PDFOptions = {
  format: "A4",
  printBackground: true,
  margin: {
    top: "0mm",
    bottom: "0mm",
    left: "0mm",
    right: "0mm",
  },
};

export function mergePdfOptions(pageSize?: [number, number]): PDFOptions {
  if (pageSize) {
    return {
      printBackground: true,
      width: `${pageSize[0]}mm`,
      height: `${pageSize[1]}mm`,
      margin: {
        top: "0mm",
        bottom: "0mm",
        left: "0mm",
        right: "0mm",
      },
    };
  }

  return { ...DEFAULT_PDF_OPTIONS };
}
