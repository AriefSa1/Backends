FROM node:18-alpine3.14 as build

WORKDIR /app

COPY package*.json .

RUN npm install

COPY . .

CMD ["npm", "run", build]