FROM node:iron

ADD ./ /api-server
WORKDIR /api-server

RUN chmod +x ./docker-scripts/start.sh
RUN chmod +x ./docker-scripts/wait-for-it.sh
RUN npm install -g npm@8.7.0

RUN npm ci
RUN npm run build

EXPOSE 3003

ENTRYPOINT ./docker-scripts/start.sh
