# API Specification

## POST /render

Generates a PDF from an array of HTML page contents.

### Request

**Content-Type:** `application/json`

**Body:**

```json
{
  "pages": ["<h1>Page 1</h1><p>Content...</p>", "<h1>Page 2</h1>"],
  "headHtml": "<script src='https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js'></script>",
  "format": "A4",
  "options": {
    "margin": {
      "top": "1cm",
      "bottom": "1cm",
      "left": "1cm",
      "right": "1cm"
    }
  }
}
```

**Fields:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `pages` | `string[]` | **Yes** | Array of HTML content strings. Each string represents one page's body content. Must contain at least one page. |
| `headHtml` | `string` | **Yes** | HTML to be inserted in the `<head>` section. Should include MathJax scripts, stylesheets, and any other document-level resources. |
| `format` | `string` | No | PDF page format. Common values: `"A4"`, `"Letter"`, `"Legal"`. Defaults to `"A4"`. |
| `options` | `object` | No | Additional PDF options (margins, etc.). See Puppeteer PDFOptions for available fields. |

**Validation Rules:**

- `pages` must be a non-empty array
- All elements in `pages` must be strings
- `headHtml` must be a string
- `format` if provided must be a valid PDF format string
- `options` if provided must be an object

### Response

**Success (200):**

**Content-Type:** `application/pdf`

Binary PDF file.

**Headers:**
- `Content-Type: application/pdf`
- `Content-Disposition: inline; filename="render.pdf"`
- `Content-Length: <size>`

**Error Responses:**

**400 Bad Request:**
```json
{
  "error": "<description of validation error>"
}
```

Common validation errors:
- `"pages" field is required`
- `"pages" must be a non-empty array`
- `All elements in "pages" must be strings`
- `"headHtml" field is required`
- `"headHtml" must be a string`

**500 Internal Server Error:**
```json
{
  "error": "Failed to render PDF"
}
```

Occurs when PDF generation fails (browser crash, invalid HTML, etc.).

## Examples

### Single Page with Math

```bash
curl -X POST http://localhost:3000/render \
  -H "Content-Type: application/json" \
  -o output.pdf \
  -d '{
    "pages": ["<h1>Quadratic Formula</h1><p>\\(x = \\frac{-b \\pm \\sqrt{b^2-4ac}}{2a}\\)</p>"],
    "headHtml": "<script src=\"https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js\"></script>"
  }'
```

### Multiple Pages

```bash
curl -X POST http://localhost:3000/render \
  -H "Content-Type: application/json" \
  -o flashcards.pdf \
  -d '{
    "pages": [
      "<h1>Card 1</h1><p>Front content</p>",
      "<h1>Card 2</h1><p>Back content</p>",
      "<h1>Card 3</h1><p>More content</p>"
    ],
    "headHtml": "<style>h1 { color: blue; }</style>"
  }'
```

### Custom Format and Margins

```bash
curl -X POST http://localhost:3000/render \
  -H "Content-Type: application/json" \
  -o letter.pdf \
  -d '{
    "pages": ["<h1>US Letter Format</h1>"],
    "headHtml": "",
    "format": "Letter",
    "options": {
      "margin": {
        "top": "0.5in",
        "bottom": "0.5in",
        "left": "0.5in",
        "right": "0.5in"
      }
    }
  }'
```

## Implementation Notes

### Page Rendering

Each page in the `pages` array is wrapped in a `<div class="pdf-page">` with CSS:
```css
.pdf-page {
  page-break-after: always;
  page-break-inside: avoid;
}
.pdf-page:last-child {
  page-break-after: auto;
}
```

This ensures each array element renders as a separate PDF page.

### MathJax Handling

If `headHtml` includes MathJax, the renderer will:
1. Wait for `window.MathJax.typesetPromise` to be available (timeout: 3s)
2. Call `MathJax.typesetPromise()` before PDF generation
3. If MathJax is not detected, proceed with PDF generation

### Complete HTML Structure

The final HTML document structure is:
```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8"/>
  {headHtml}
  <style>/* page-break styles */</style>
</head>
<body>
  <div class="pdf-page">{pages[0]}</div>
  <div class="pdf-page">{pages[1]}</div>
  ...
</body>
</html>
```
