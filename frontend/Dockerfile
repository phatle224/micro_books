# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .

ARG ORDER_SERVICE_URL=http://order-service:3001
ARG INVENTORY_SERVICE_URL=http://inventory-service:3002
ENV ORDER_SERVICE_URL=$ORDER_SERVICE_URL
ENV INVENTORY_SERVICE_URL=$INVENTORY_SERVICE_URL

RUN npm run build

# Stage 2: Production runtime
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./
COPY --from=builder /app/next.config.ts ./

EXPOSE 3000

CMD ["npm", "run", "start"]
