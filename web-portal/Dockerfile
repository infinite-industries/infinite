FROM node:8

# If used on client needs to built into the image when transpilation happens
ARG API_URL=https://staging-api.infinite.industries
ARG CLIENT_ID='PYKhof4U0jKE3v4h8xKSgihHz9atBE5O'
ARG CLIENT_DOMAIN='1nfinite.auth0.com'
ARG REDIRECT='http://localhost:7779/callback'
ARG AUDIENCE='https://1nfinite.auth0.com/api/v2/'
ARG GIT_VERSION

# Server Side
ENV ENV=prod
ENV SITE_URL=https://staging.infinite.industries
ENV SLACK_WEBHOOK_TEST=https://hooks.slack.com/services/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
ENV SLACK_WEBHOOK_CONTACT=https://hooks.slack.com/services/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
ENV SLACK_WEBHOOK_EVENT_SUBMISSION=https://hooks.slack.com/services/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
ENV LIVE_MAILGUN_DOMAIN=mg.infinite.industries
ENV AWS_REGION=us-east-1
ENV AWS_SERVER_URL=https://s3.us-east-2.amazonaws.com/
ENV AWS_S3_UPLOADS_BUCKET=test-downloader
ENV SECRET_STRING_FILE=./keys/1nfinite.pem

ENV LIVE_MAILGUN_API_KEY = ""
ENV BITLY_TOKEN = ""
ENV AWS_ACCESS_KEY_ID=""
ENV AWS_SECRET_ACCESS_KEY=""


RUN mkdir /build-dir
WORKDIR /build-dir
RUN git clone https://github.com/infinite-industries/infinite.git ./
RUN git checkout ${GIT_VERSION}
WORKDIR /build-dir/web-portal

## create .env for client build
RUN echo "API_URL=${API_URL}" >> ./.env
## Create clientConfig based on supplied ARGS
RUN echo "export const CLIENT_ID = '${CLIENT_ID}'\n" >> /build-dir/web-portal/src/clientConfig.js
RUN echo "export const CLIENT_DOMAIN = '${CLIENT_DOMAIN}'\n" >> /build-dir/web-portal/src/clientConfig.js
RUN echo "export const REDIRECT = '${REDIRECT}'\n" >> /build-dir/web-portal/src/clientConfig.js
RUN echo "export const AUDIENCE = '${AUDIENCE}'\n" >> /build-dir/web-portal/src/clientConfig.js

RUN npm ci
RUN npm run production-build
RUN npm ci --production

RUN rm ./.env
COPY ./ /usr/src/app
WORKDIR /usr/src/app

RUN rm -rf /build-dir

# You will need to mount this to a location on the server which contains 1nfinite.pem
VOLUME /usr/src/app/keys

EXPOSE 7779

CMD ["npm", "start"]
