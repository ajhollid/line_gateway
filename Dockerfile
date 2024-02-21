FROM node:18.19.0-alpine3.18
ENV PM2_HOME /usr/src/app/pm2
ENV npm_config_cache /tmp/npm
WORKDIR /usr/src/app
COPY package.json package-lock.json ./
RUN npm install
RUN npm install pm2 -g
RUN mkdir /usr/src/app/pm2&& chgrp -R 0 /usr/src/app/pm2 && chmod -R g=u /usr/src/app/pm2 
COPY src src
COPY ssl ssl
RUN npm test
COPY ecosystem.config.cjs ./
CMD ["pm2-runtime", "ecosystem.config.cjs"]