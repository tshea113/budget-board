FROM node:lts-alpine as build-stage

ARG VITE_API_URL
ARG VITE_API_URL ${VITE_API_URL}

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
FROM nginx:stable-alpine as production-stage

COPY --from=build-stage /app/dist /usr/share/nginx/html
COPY --from=build-stage /app/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]