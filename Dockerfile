FROM node:18.19.0-alpine3.18
USER root
COPY package.json package-lock.json WebhookServer.js TextUtils.js ./
ENV npm_config_cache /tmp/npm
RUN npm install
EXPOSE 33333
CMD ["npm", "start"]