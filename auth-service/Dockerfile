FROM node:20-alpine
# ── Install OpenSSL (required by Prisma on Alpine/musl) ──────
RUN apk add --no-cache openssl
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npx prisma generate
RUN npm run build
EXPOSE 3005
CMD ["node", "dist/main"]
