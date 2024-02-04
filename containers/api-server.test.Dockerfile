FROM node:iron

# This assumes that you mount the pem file into a volume at /api-server/keys/1nfiniteDocker.pem
ENV JWT_PEM='/api-server/keys/1nfiniteDocker.pem'

ADD containers/api-server.test.docker-scripts /scripts
RUN chmod +x /scripts/*
ADD api-server /api-server
#RUN mkdir /keys

CMD /scripts/start.sh
