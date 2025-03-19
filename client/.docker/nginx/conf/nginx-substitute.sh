#!/bin/sh
# Make sure your end of line is LF. Otherwise this will cause issues.
export DOLLAR="$"
envsubst < default.conf.template > /etc/nginx/conf.d/default.conf
nginx -g "daemon off;"