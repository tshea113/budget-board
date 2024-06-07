FROM node:lts-alpine as build-stage

ARG VITE_API_URL
ARG VITE_API_URL ${VITE_API_URL}

ENV NODE_ENV=development
WORKDIR /app

COPY client/.yarnrc.yml .
COPY client/.yarn ./.yarn
RUN yarn set version stable

COPY ["./client/package.json", "./client/yarn.lock", "./"]
RUN yarn install

COPY ./client/ .
RUN yarn run build

# production stage
FROM nginx:stable-alpine as production-stage

COPY --from=build-stage /app/dist /usr/share/nginx/html
COPY --from=build-stage /app/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]