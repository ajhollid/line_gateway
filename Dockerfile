FROM node:18.19.0-alpine3.18
COPY package.json package-lock.json ./
COPY src src
ENV npm_config_cache /tmp/npm
RUN npm install
EXPOSE 33333
CMD ["npm", "start"]