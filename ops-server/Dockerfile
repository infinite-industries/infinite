FROM docker.io/library/postgres:alpine

RUN apk --no-cache add \
  less curl coreutils grep gawk perl doas doas-sudo-shim \
  aws-cli mandoc

RUN adduser -h /home/infinite -s /bin/bash -D infinite infinite && \
    addgroup infinite wheel && \
    echo "permit nopass :wheel" > /etc/doas.d/allow-wheel.conf

USER infinite
