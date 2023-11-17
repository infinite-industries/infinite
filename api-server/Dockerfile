FROM node:gallium

USER node

WORKDIR /home/node/api-server

# Build depedencies
# build these first, since they don't change as much as our code
COPY --chown=node:node package.json package-lock.json ./
RUN npm install npm@8.7.0
RUN npm ci

# Build code
COPY --chown=node:node ./ ./
RUN npm run build

EXPOSE 3003

ENTRYPOINT npm start
#RUN npm start
#ENTRYPOINT /bin/bash
