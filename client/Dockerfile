FROM node:lts-alpine AS build-stage

WORKDIR /app

COPY ./package.json .
RUN yarn install

COPY . .
RUN yarn run build

# production stage
FROM nginx:stable-alpine AS production-stage

COPY --from=build-stage /app/dist /usr/share/nginx/html
COPY .docker/nginx/init-scripts/ /docker-entrypoint.d/

COPY .docker/nginx/conf/nginx-substitute.sh .
COPY .docker/nginx/conf/default.conf.template .

EXPOSE ${PORT}
ENTRYPOINT [ "/bin/sh", "nginx-substitute.sh"]