FROM docker.io/library/alpine:3

RUN apk --no-cache add \
  less curl coreutils grep gawk perl doas doas-sudo-shim \
  postgresql-client aws-cli \
  postgresql-doc mandoc

RUN adduser -h /home/infinite -s /bin/bash -D infinite infinite && \
    addgroup infinite wheel && \
    echo "permit nopass :wheel" > /etc/doas.d/allow-wheel.conf

ADD --chown=infinite:infinite backup /home/infinite/bin/

USER infinite

WORKDIR /home/infinite

# default local file retention for backups
ENV NUM_DAYS=10
CMD bin/backup
