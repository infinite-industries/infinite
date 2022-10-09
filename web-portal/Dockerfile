FROM node:gallium

ARG GOOGLE_ANALYTICS_ID='UA-73795062-1'
ENV GOOGLE_ANALYTICS_ID=${GOOGLE_ANALYTICS_ID}

ADD ./ /web-portal

RUN npm install -g npm@8.7.0

WORKDIR /web-portal/docker-scripts/proxy-server
RUN npm install

WORKDIR /web-portal

RUN chmod +x ./docker-scripts/start.sh

RUN touch ./.env # this files needs to be here but won't be used
RUN npm install # can't use npm ci because we need build tooling
RUN npm run build

EXPOSE 7779

ENTRYPOINT ./docker-scripts/start.sh
