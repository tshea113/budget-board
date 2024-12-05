#!/bin/sh
export DOLLAR="$"
envsubst < default.conf.template > /etc/nginx/conf.d/default.conf
nginx -g "daemon off;"