FROM node:14 as build


COPY ./package-lock.json ./
COPY ./package.json ./
RUN npm ci

FROM node:14
USER node
COPY ./src ./src
COPY --from=build ./node_modules /srv/package/node_modules

CMD npm run start
