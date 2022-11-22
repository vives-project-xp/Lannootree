#!/bin/bash

echo "Webhook received for branch '$1'"

cd /Lannootree
git pull
cd /Lannootree/Lannootree_server
docker-compose up -d --build frontend admin-api client-api controller effect-generator uploader-api
exit 0