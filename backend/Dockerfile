# Development Stage
FROM node:22-alpine AS dev

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "run",  "dev"]