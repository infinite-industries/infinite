FROM node:gallium

ADD ./ /web-portal

RUN npm install -g npm@8.6.0

WORKDIR /web-portal

RUN touch ./.env # this files needs to be here but won't be used
RUN npm install # can't use npm ci because we need build tooling
RUN npm run build

EXPOSE 7779

ENTRYPOINT npm run start
