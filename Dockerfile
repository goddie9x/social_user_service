# syntax=docker/dockerfile:1
FROM node:18-alpine
# git: needed to install @godsocial/utils from its git URL
RUN apk add --no-cache git && \
    addgroup -S app && adduser -S app -G app
WORKDIR /app
COPY package*.json ./
RUN npm install --omit=dev --no-audit --no-fund && npm cache clean --force
COPY . .
RUN chown -R app:app /app
USER app
EXPOSE 3000 50051
CMD ["node", "index.js"]
