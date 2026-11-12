FROM node:24-alpine
WORKDIR /app
COPY package.json ./
COPY dist ./dist
COPY server ./server
COPY drizzle ./drizzle
ENV PORT=8080 WSMS_DATA_DIR=/data
EXPOSE 8080
CMD ["node", "server/local.mjs"]
