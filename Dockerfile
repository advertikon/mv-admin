FROM node:18-alpine as build
COPY . .

RUN touch .env
RUN echo 'NEXT_PUBLIC_BACK_END=https://shopify-layered-search.maxvehicle.com' >> .env
RUN echo 'NEXT_PUBLIC_OAUTH_SERVER=https://oauth.maxvehicle.com' >> .env
RUN echo 'NEXT_PUBLIC_SENTINEL_DSN=https://77507d9ab8a94428a7f9717546a6eb16@o1226409.ingest.sentry.io/4504570939441152' >> .env
RUN echo 'NEXT_PUBLIC_CLIENT_ID=admin_app' >> .env
RUN echo 'NEXT_PUBLIC_CLIENT_SECRET=p6OHtt0jGikDcv3WbLNueZE1lmwRXShX21L5t7p0P1bM3jSLDiKDUoEOq6VoWRWzv7ybdYkzdXyZnRucj3XjYCFhU8v7pwZbIGg3dnG55UOCLb6PEaePt7LNNC25IBHn' >> .env
RUN echo 'NEXT_PUBLIC_REDIRECT_URL=https://admin.maxvehicle.com/oauth/token/exchange' >> .env

RUN npm i
RUN npm run build

FROM node:18-alpine

COPY --from=build .next .next
COPY public public
COPY package.json .
COPY next.config.js .
RUN npm i --omit=dev
CMD npm run start

EXPOSE 3000