"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_PDF_OPTIONS = void 0;
exports.mergePdfOptions = mergePdfOptions;
exports.DEFAULT_PDF_OPTIONS = {
    format: "A4",
    printBackground: true,
    margin: {
        top: "0mm",
        bottom: "0mm",
        left: "0mm",
        right: "0mm",
    },
};
function mergePdfOptions(pageSize) {
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
    return { ...exports.DEFAULT_PDF_OPTIONS };
}
