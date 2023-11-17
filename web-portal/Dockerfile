FROM node:gallium

ARG GOOGLE_ANALYTICS_ID='UA-73795062-1'
ENV GOOGLE_ANALYTICS_ID=${GOOGLE_ANALYTICS_ID}

USER node

WORKDIR /home/node/web-portal

#
# build dependencies first, since they don't change as much as our code
#
COPY --chown=node:node package.json package-lock.json ./
COPY --chown=node:node docker-scripts/proxy-server/ docker-scripts/proxy-server/

#
## proxy server
RUN cd docker-scripts/proxy-server \
  && npm install
#
## main code
RUN npm install npm@8.7.0
RUN npm install
#
##
## Build our code
##
COPY --chown=node:node ./ ./
RUN npm run build
#
EXPOSE 7779
#
ENTRYPOINT npm start 
