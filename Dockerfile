# ---- Build stage ----
FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build -- --configuration production

# ---- Serve stage ----
FROM nginx:alpine

COPY --from=builder /app/dist/colors/browser /usr/share/nginx/html
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

EXPOSE 80

CMD ["/entrypoint.sh"]



# # ---- Build stage ----
# FROM node:22-alpine AS builder

# WORKDIR /app

# COPY package*.json ./
# RUN npm ci

# COPY . .
# RUN npm run build -- --configuration production

# # ---- Serve stage ----
# FROM nginx:alpine

# COPY --from=builder /app/dist/colors/browser /usr/share/nginx/html

# EXPOSE 80

# CMD ["nginx", "-g", "daemon off;"]