FROM ghcr.io/jswank/alpine-cli:latest

USER root

RUN apk -U --no-cache add \
  postgresql-client aws-cli  

COPY home/bin/* /home/cli/bin

RUN chown -R cli:cli /home/cli

USER cli
