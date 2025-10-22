"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_PDF_OPTIONS = void 0;
exports.mergePdfOptions = mergePdfOptions;
exports.DEFAULT_PDF_OPTIONS = {
    format: "A4",
    printBackground: true,
    margin: {
        top: "1cm",
        bottom: "1cm",
        left: "1cm",
        right: "1cm",
    },
};
const DEFAULT_MARGIN = exports.DEFAULT_PDF_OPTIONS.margin ?? {};
function mergePdfOptions(custom) {
    if (!custom) {
        return {
            ...exports.DEFAULT_PDF_OPTIONS,
            margin: { ...DEFAULT_MARGIN },
        };
    }
    const mergedMargin = custom.margin
        ? { ...DEFAULT_MARGIN, ...custom.margin }
        : { ...DEFAULT_MARGIN };
    const { margin, ...rest } = custom;
    return {
        ...exports.DEFAULT_PDF_OPTIONS,
        ...rest,
        margin: mergedMargin,
    };
}
