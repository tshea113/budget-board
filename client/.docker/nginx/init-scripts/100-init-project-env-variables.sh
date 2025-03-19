#!/bin/sh

set -ex

# Find the file where environment variables need to be replaced.
projectEnvVariables=$(ls -t /usr/share/nginx/html/assets/projectEnvVariables*.js | head -n1)

# Replace environment variables
envsubst < "$projectEnvVariables" > ./projectEnvVariables_temp
cp ./projectEnvVariables_temp "$projectEnvVariables"
rm ./projectEnvVariables_temp