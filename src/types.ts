import { PDFOptions } from "puppeteer";

export type RenderOptions = Partial<PDFOptions>;

export interface RenderRequestBody {
  pages?: string[];
  headHtml?: string;
  format?: PDFOptions["format"];
  options?: RenderOptions;
}
