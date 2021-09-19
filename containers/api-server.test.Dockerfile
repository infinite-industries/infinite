FROM node:fermium-alpine

ENV BITLY_TOKEN = ''
ENV INFINITE_PEM_FILE_CONTENTS = ''

ENV JWT_PEM='/api-server/keys/1nfiniteDocker.pem'

ADD containers/api-server.test.docker-scripts /scripts
RUN chmod +x /scripts/*
ADD api-server /api-server
#RUN mkdir /keys

CMD /scripts/start.sh

