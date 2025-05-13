# Development stage
FROM node:22-alpine AS dev

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

CMD ["npm", "run", "dev"]