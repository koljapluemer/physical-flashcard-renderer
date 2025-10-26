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

## API Documentation

See [API.md](./API.md) for complete API specification.

## Test With curl

### Single Page

```bash
curl -X POST http://localhost:3000/render \
  -H "Content-Type: application/json" \
  -o sample.pdf \
  -d '{
    "pages": ["<h1>Hello</h1><p>Test</p>"],
    "headHtml": ""
  }'
```

### Single Page with Math

```bash
curl -X POST http://localhost:3000/render \
  -H "Content-Type: application/json" \
  -o math.pdf \
  -d '{
    "pages": ["<h1>Quadratic Formula</h1><p>When <em>a</em> ≠ 0:</p><p>\\(x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}\\)</p>"],
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
      "<h1>Card 1</h1><p>Front side</p>",
      "<h1>Card 2</h1><p>Back side</p>",
      "<h1>Card 3</h1><p>Another card</p>"
    ],
    "headHtml": "<style>h1 { color: navy; }</style>"
  }'
```

### Custom Format

```bash
curl -X POST http://localhost:3000/render \
  -H "Content-Type: application/json" \
  -o letter.pdf \
  -d '{
    "pages": ["<h1>US Letter</h1>"],
    "headHtml": "",
    "format": "Letter"
  }'
```
