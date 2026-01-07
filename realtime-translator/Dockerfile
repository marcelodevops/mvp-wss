# ---------- Build stage ----------
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY tsconfig.json ./
COPY . .

RUN npm install


# ---------- Runtime stage ----------
FROM node:20-alpine

WORKDIR /app

ENV NODE_ENV=production

COPY package*.json ./
RUN npm ci --omit=dev
RUN npm install expo-cli
RUN npm install

COPY --from=builder . .

EXPOSE 8080

CMD ["npx", "expo start"]
