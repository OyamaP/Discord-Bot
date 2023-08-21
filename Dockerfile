FROM denoland/deno:alpine-1.36.1 AS deno
ENV LANG C.UTF-8
# alpineベースではENVによるTZ設定が効かないためtzdataを利用する
RUN apk --update add --no-cache tzdata tini &&\
    cp /usr/share/zoneinfo/Asia/Tokyo /etc/localtime
# PID1問題でtiniを利用する
ENTRYPOINT ["/sbin/tini", "--"]
USER deno
EXPOSE 8000

# CMD ["deno", "task", "start"]

