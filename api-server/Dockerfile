FROM node:gallium

ADD ./ /api-server
WORKDIR /api-server

RUN npm install -g npm@8.6.0

RUN npm ci
RUN npm run build

EXPOSE 3003

ENTRYPOINT npm run start
