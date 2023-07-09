# setting #
###########
FROM node:18.12.0-alpine AS setting
ENV LANG C.UTF-8
# alpineベースではENVによるTZ設定が効かないためtzdataを利用する
RUN apk --update add --no-cache tzdata tini &&\
    cp /usr/share/zoneinfo/Asia/Tokyo /etc/localtime
# PID1問題でtiniを利用する
ENTRYPOINT ["/sbin/tini", "--"]
USER node
EXPOSE 3000


# builder #
###########
FROM setting AS builder
WORKDIR /app
COPY . .
RUN npm ci --no-progress && npm run build


# develop image #
#################
FROM setting AS develop
ENV NODE_ENV develop
WORKDIR /app
COPY ./package*.json ./
COPY --from=builder /app/build ./build
COPY --from=builder /app/node_modules ./node_modules
CMD ["npm", "start"]


# production image #
####################
FROM setting AS production
ENV NODE_ENV production
WORKDIR /app
COPY ./package*.json ./
COPY --from=builder /app/build ./build
RUN npm ci --production --no-progress
CMD ["npm", "start"]
