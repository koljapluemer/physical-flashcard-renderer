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

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `3000` |
| `ALLOW_ALL_ORIGINS` | Set to `"true"` to allow CORS from all origins (use in development/local only) | `undefined` (CORS disabled) |
| `REQUEST_LIMIT` | Maximum request body size | `"5mb"` |
| `CHROME_EXECUTABLE_PATH` | Custom Chrome/Chromium path | System default |
| `PUPPETEER_SKIP_DOWNLOAD` | Skip Puppeteer Chromium download | `undefined` |

### Local Development with CORS

```bash
ALLOW_ALL_ORIGINS=true npm run dev
```

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

### Custom Page Size

```bash
curl -X POST http://localhost:3000/render \
  -H "Content-Type: application/json" \
  -o custom.pdf \
  -d '{
    "pages": ["<h1>Custom Size</h1><p>40mm × 60mm card</p>"],
    "headHtml": "",
    "pageSize": [40, 60]
  }'
```
