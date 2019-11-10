FROM node:8

# Build Arguments (Passed At Build Time)
ARG GIT_VERSION

# Environment (Passed At Run Time)
ENV POSTGRES_USER = ""
ENV POSTGRES_PW = ""
ENV POSTGRES_HOST = ""
ENV POSTGRES_DB = ""
ENV POSTGRES_PORT = ""

ENV SLACK_WEBHOOK_TEST = ""
ENV SLACK_WEBHOOK_CONTACT = ""
ENV SLACK_WEBHOOK_EVENT_SUBMISSION = ""
ENV SLACK_WEBHOOK_VENUE_SUBMISSION = ""

ENV BITLY_TOKEN = ""
ENV APP_URL = ""

RUN mkdir /infinite
WORKDIR /infinite

RUN git clone https://github.com/infinite-industries/infinite.git ./
RUN git checkout ${GIT_VERSION}
WORKDIR /infinite/api-server

RUN npm ci

# Mount this to the location containing your private key
VOLUME /infinite/api-server/keys

EXPOSE 3003

CMD ["npm", "start"]
