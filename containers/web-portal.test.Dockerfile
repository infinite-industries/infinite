FROM node:erbium

ADD containers/web-portal.test.docker-scripts /scripts
RUN chmod +x /scripts/*
ADD web-portal /web-portal

WORKDIR /scripts/proxy-server
RUN npm install

CMD /scripts/start.sh

