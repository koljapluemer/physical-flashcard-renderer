# Physical Flashcard Renderer

Node.js service that converts submitted HTML (including MathJax content) into PDF using Puppeteer.

## Setup

```bash
npm install
npm run build
```

> `npm install` will download the compatible Chromium build via Puppeteer’s `postinstall` hook so the renderer can run in production.

Copy `.env.example` to `.env` and adjust values for your deployment environment.

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
| `ALLOW_ALL_ORIGINS` | Set to `"true"` to allow CORS from all origins (development/local only) | `undefined` (CORS disabled) |
| `CORS_ALLOWED_ORIGINS` | Comma-separated list of origins allowed when `ALLOW_ALL_ORIGINS` is not `"true"` | `undefined` |
| `REQUEST_LIMIT` | Maximum request body size | `"5mb"` |
| `CHROME_EXECUTABLE_PATH` | Provide a custom Chrome/Chromium path if needed | System default / bundled Chromium |
| `PUPPETEER_SKIP_DOWNLOAD` | Set to `"true"` to skip downloading Chromium during install (not recommended for deployments) | `undefined` |

### Local Development with CORS

```bash
ALLOW_ALL_ORIGINS=true npm run dev
```

## Deployment

The service targets native Node runtimes (e.g., Render.com Web Service). Configure your host to run:

```bash
npm install && npm run build
npm start
```

Ensure the necessary environment variables (see `.env.example`) are set in your hosting dashboard.

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
    "pages": ["<h1>Custom Size</h1><p>50mm × 60mm card</p>"],
    "headHtml": "",
    "pageSize": [50, 60]
  }'
```
