import { PDFOptions } from "puppeteer";

export type RenderOptions = Partial<PDFOptions>;

export interface RenderRequestBody {
  html?: string;
  options?: RenderOptions;
}
