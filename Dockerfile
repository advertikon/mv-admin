FROM node:20-alpine as build
COPY . .

RUN npm ci
RUN npm run build

FROM node:20-alpine

WORKDIR app

COPY --from=build .next .next
COPY public public
COPY scripts scripts
COPY package.json package-lock.json next.config.js .env ./

RUN npm ci --omit=dev

CMD npm run start

EXPOSE 3000