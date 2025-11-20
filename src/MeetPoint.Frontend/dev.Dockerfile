FROM node:22-alpine AS build

WORKDIR /app

RUN npm install -g @angular/cli

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD ["ng", "serve", "--host", "0.0.0.0", "--port", "3000", "--allowed-hosts=true"]
