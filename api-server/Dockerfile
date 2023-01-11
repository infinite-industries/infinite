FROM node:19-alpine

WORKDIR /api-server

RUN apk -U --no-cache add \
  bash just

COPY justfile package.json package-lock.json ./
RUN just install-deps

COPY . .
RUN just build

EXPOSE 3003
CMD ["npm", "start"]
