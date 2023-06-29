FROM node:18-alpine as build
COPY . .

RUN npm i
RUN npm run build

FROM node:18-alpine

WORKDIR app

COPY --from=build .next .next
COPY public public
COPY scripts scripts
COPY package.json next.config.js .env ./

RUN npm i --omit=dev

CMD npm run start

EXPOSE 3000