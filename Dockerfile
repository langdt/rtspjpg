FROM node:alpine3.14

RUN apk update \
    && apk add bash ffmpeg \
    && rm -rf /var/cache/apk/*

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY server.js ./

EXPOSE 3000

CMD ["node", "server.js"]

