#!/usr/bin/env bash
export DOLLAR="$"
envsubst < /etc/nginx/conf.d/custom-nginx.conf.template > /etc/nginx/conf.d/default.conf
nginx -g "daemon off;"