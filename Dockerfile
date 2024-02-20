FROM node:18.19.0-alpine3.18
COPY package.json package-lock.json ./
COPY src src
COPY ssl ssl
COPY ecosystem.config.cjs ./
ENV npm_config_cache /tmp/npm
ENV PM2_HOME /tmp/.pm2
RUN npm install
RUN npm install pm2 -g
RUN chown -R 1000980000:0 "/tmp/npm"
CMD ["pm2-runtime", "ecosystem.config.cjs"]