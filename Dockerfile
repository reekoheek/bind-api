FROM node:alpine

ARG build=release

COPY ./ /app

WORKDIR /app

RUN set -x \
  && echo "arg:build = $build" \
  && apk add --no-cache bind \
  && rm -rf /etc/bind \
  && mkdir -p /etc/bind \
  && echo 'include "/etc/bind/named.conf.options";' >> /etc/bind/named.conf \
  && echo 'include "/etc/bind/named.conf.local";' >> /etc/bind/named.conf \
  && touch /etc/bind/named.conf.options \
  && touch /etc/bind/named.conf.local \
  && rndc-confgen -a \
  && npm install --quiet --production

RUN set -x \
  && if [ "$build" = "debug" ]; then \
    npm install mocha supertest --quiet \
    ; \
  fi

EXPOSE 3000

CMD ["node", "server.js"]
