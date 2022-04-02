FROM node:gallium

ADD containers/api-server.test.docker-scripts /scripts
ADD api-server /api-server
WORKDIR /api-server

RUN npm ci
RUN npm run build

ENTRYPOINT run start