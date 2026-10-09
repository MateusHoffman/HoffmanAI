FROM node:24-bookworm-slim AS build
WORKDIR /app
COPY apps/web/package.json ./
RUN npm install
COPY apps/web/ ./
COPY curriculo.md ./public/curriculo.md
ARG VITE_API_BASE_URL=
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
RUN npm run build

FROM nginx:1.28-alpine
ENV API_UPSTREAM=api:8080
COPY apps/web/nginx.conf.template /etc/nginx/templates/default.conf.template
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
