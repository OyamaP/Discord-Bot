## パッケージのインストール
FROM node:18.12.0-alpine as desp-stage
WORKDIR /app

COPY ./package*.json ./
RUN npm install --production --no-progress

## buildを実行
FROM node:18.12.0-alpine as build-stage

WORKDIR /work

COPY . /work/

RUN npm install --no-progress
RUN npm run build

## runtime環境を作成
FROM node:18.12.0-alpine as runtime-stage

ENV LANG C.UTF-8
ENV TZ Asia/Tokyo

WORKDIR /app

COPY ./package*.json ./
COPY --from=desp-stage /app/node_modules ./node_modules
COPY --from=build-stage /work/build ./build

## PID1問題に対応する
RUN apk add --no-cache tini
ENTRYPOINT ["/sbin/tini", "--"]

USER node

EXPOSE 3000

ENV NODE_ENV prod

CMD ["npm", "start"]
