FROM node:18-alpine
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install --production --legacy-peer-deps
COPY . .
EXPOSE 50051
EXPOSE 3000
CMD ["npm","start"]