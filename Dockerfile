FROM node:18.19.0-alpine3.18
COPY package.json package-lock.json ./
COPY src src
COPY ssl ssl
ENV npm_config_cache /tmp/npm
RUN npm install
RUN chown -R 1000980000:0 "/tmp/npm"

CMD ["npm", "start"]