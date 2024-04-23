FROM alpine:3.19.1
ENV NODE_VERSION 20.12.2

RUN apk --update --no-cache add nodejs npm

WORKDIR /app

COPY package.json package-lock.json /app/

RUN npm ci --omit=dev && \
    npm i -g nodemon

COPY ./src .

ENV Env prod
EXPOSE 8082

CMD nodemon ./server/index.js