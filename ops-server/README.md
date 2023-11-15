# ops

A minimal image for running Linux CLI utilities - shell scripts and similar.

## Quickstart

```console
$ docker run -ti --rm ghcr.io/infinite-industries/ops /bin/bash
```

## Why?

A primary use case for this image is to create database backups.

Infinite Industries applications are deployed as Docker containers. The host
environment does not include utilities to interact with the database (psql/etc) or
AWS. A container using this image can be used for that.

A `.env` file can be used to set environment variables like DB and AWS
credentials, and that file can be managed the same way it is managed for other
containers (like *api* and *web-portal*).

