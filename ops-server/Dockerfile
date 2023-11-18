FROM ghcr.io/jswank/alpine-cli:latest

USER root

RUN apk --no-cache add \
  postgresql-client aws-cli  

ADD --chown=cli:cli home/bin/ /home/cli/bin/

USER cli
