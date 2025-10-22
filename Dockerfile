FROM node:18-slim AS build

WORKDIR /app

COPY package*.json ./
COPY tsconfig.json ./

RUN npm install

COPY src ./src

RUN npm run build

FROM node:18-slim AS runtime

WORKDIR /app

ENV NODE_ENV=production

COPY package*.json ./
RUN npm install --omit=dev

COPY --from=build /app/dist ./dist

EXPOSE 3000

CMD ["node", "dist/server.js"]
