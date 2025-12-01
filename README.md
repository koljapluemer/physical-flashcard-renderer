# Physical Flashcard Renderer

Node.js service that converts submitted HTML (including MathJax content) into PDF using Puppeteer.

## Setup

```bash
npm install
git submodule add git@github.com:koljapluemer/physical-flashcard-doc.git doc 
```

- `npm install` will download the compatible Chromium build via Puppeteer’s `postinstall` hook so the renderer can run in production.
- copy `.env.example` to `.env` and adjust values for your deployment environment.

## Development

- `npm run build` for type-check
- should be run via `just run` from backend repo (ofc `npm run dev` works)

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `3000` |
| `CORS_ALLOWED_ORIGINS` | Comma-separated list of origins allowed for CORS | `undefined` |
| `CHROME_EXECUTABLE_PATH` | Provide a custom Chrome/Chromium path if needed | System default / bundled Chromium |

## Deployment

### Docker / Render.com

The service now ships with a Chromium-ready Docker image (recommended for Render.com / Fly.io). Build and run locally:

```bash
docker build -t physical-flashcard-renderer .
docker run --rm -p 3000:3000 --env-file .env physical-flashcard-renderer
```

On Render.com choose **Runtime → Docker** and point to this repo. Render will execute the `Dockerfile` automatically; no extra build/start commands are required. Configure the environment variables (see `.env.example`) in the Render dashboard.

### Manual Node Runtime

If you intentionally skip Docker, ensure your host installs the system libraries required by headless Chrome, then run:

```bash
npm install
npm run build
npm start
```
