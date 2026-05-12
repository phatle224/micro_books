# Giai đoạn 1: Xây dựng (Build Stage)
FROM node:20-alpine AS builder

# Thiết lập thư mục làm việc trong container
WORKDIR /app

# Sao chép file cấu hình package để cài đặt dependencies trước (tận dụng Docker cache)
COPY package.json package-lock.json ./
RUN npm install

# Sao chép toàn bộ mã nguồn vào container
COPY . .

# Khai báo các tham số build (có thể ghi đè khi build)
ARG ORDER_SERVICE_URL=http://order-service:3001
ARG INVENTORY_SERVICE_URL=http://inventory-service:3002

# Thiết lập biến môi trường cho quá trình build Next.js
ENV ORDER_SERVICE_URL=$ORDER_SERVICE_URL
ENV INVENTORY_SERVICE_URL=$INVENTORY_SERVICE_URL

# Thực hiện build ứng dụng Next.js
RUN npm run build

# Giai đoạn 2: Chạy ứng dụng (Production Runtime Stage)
FROM node:20-alpine AS runner

WORKDIR /app

# Thiết lập môi trường là production
ENV NODE_ENV=production

# Chỉ sao chép các tệp tin cần thiết từ giai đoạn builder để giảm kích thước image
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./
COPY --from=builder /app/next.config.ts ./

# Mở cổng 3000 cho ứng dụng
EXPOSE 3000

# Lệnh khởi chạy ứng dụng khi container bắt đầu
CMD ["npm", "run", "start"]
