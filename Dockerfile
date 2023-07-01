# build作成 #
#############
FROM node:18.12.0-alpine AS builder

WORKDIR /app
COPY . .
RUN npm ci --no-progress && npm run build

# image作成 #
#############
FROM node:18.12.0-alpine AS image
ENV LANG C.UTF-8
ENV TZ Asia/Tokyo
ENV NODE_ENV production

WORKDIR /app
COPY ./package*.json ./
COPY --from=builder /app/build ./build
RUN npm ci --production --no-progress

# PID1問題対応
RUN apk add --no-cache tini
ENTRYPOINT ["/sbin/tini", "--"]

USER node
EXPOSE 3000
CMD ["npm", "start"]
