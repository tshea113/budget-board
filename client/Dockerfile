FROM node:lts-alpine AS build-stage

RUN echo $VITE_VERSION


ENV NODE_ENV=development
ENV NODE_OPTIONS="--max-old-space-size=4096"
WORKDIR /app

COPY .yarnrc.yml .
COPY .yarn ./.yarn
RUN yarn set version stable

COPY ["./package.json", "./yarn.lock", "./"]
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