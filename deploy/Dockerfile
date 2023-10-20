FROM node:20-alpine
LABEL maintainer="haiwei8086@163.com"


ENV DISABLE_NOTIFIER true
ENV NO_POSTINSTALL true

ENV ENV=${ENV}


WORKDIR /var/web
ADD . .


RUN apk add --no-cache curl

RUN curl "https://download.maxmind.com/app/geoip_download?edition_id=GeoLite2-Country&license_key=S8aC6rrcgWY9iaHk&suffix=tar.gz" -o GeoLite2-Country.tar.gz \
  && tar -xzvf GeoLite2-Country.tar.gz \
  && mv -f GeoLite2-Country_*/GeoLite2-Country.mmdb dist/GeoLite2-Country.mmdb


RUN npm i -g typescript \
    && yarn install \
    && export NODE_ENV=production \
    && yarn run build


EXPOSE 3000
VOLUME ["/var/web/logs"]

CMD ["/bin/sh", "-c", "node ./dist_backend/backend/server.js --env=$ENV"]