FROM node:26.12.1

ADD ./ /api-server
WORKDIR /api-server

RUN chmod +x ./docker-scripts/start.sh
RUN chmod +x ./docker-scripts/wait-for-it.sh

RUN npm ci
RUN npm run build

EXPOSE 3003

ENTRYPOINT ./docker-scripts/start.sh
