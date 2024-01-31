FROM node:18.19.0-alpine3.18
COPY package.json package-lock.json ./
COPY src src
COPY ssl ssl
ENV npm_config_cache /tmp/npm
RUN npm install
CMD ["npm", "start"]