FROM node:8

COPY ./start.sh /
RUN chmod +x ./start.sh

# Mount this to the location containing your private key
VOLUME /api-server

EXPOSE 3003

CMD ["/bin/bash", "start.sh"]
