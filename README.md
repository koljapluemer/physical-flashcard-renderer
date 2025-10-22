# Physical Flashcard Renderer

Node.js service that converts submitted HTML (including MathJax content) into PDF using Puppeteer.

## Setup

```bash
npm install
npm run build
```

## Development

```bash
npm run dev
```

## Production Run

```bash
npm start
```

The server listens on `http://localhost:3000` by default.

## Test With curl

```bash
curl -X POST http://localhost:3000/render \
  -H "Content-Type: application/json" \
  -o sample.pdf \
  -d '{"html":"<html><body><h1>Hello</h1><p>Test</p></body></html>"}'
```
The command writes the generated PDF to `sample.pdf`.

Here is one with math:

```bash
curl -X POST http://localhost:3000/render \
  -H "Content-Type: application/json" \
  -o math.pdf \
  -d '{
        "html": "<!DOCTYPE html><html><head><meta charset=\"utf-8\"/><title>Math Test</title><script src=\"https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js\" async></script></head><body><h1>Quadratic Formula</h1><p>When <em>a</em> \u2260 0:</p><p>\\(x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}\\)</p><p>Example: if a = 1, b = -3, c = 2, then roots are 1 and 2.</p></body></html>"
      }'
```

