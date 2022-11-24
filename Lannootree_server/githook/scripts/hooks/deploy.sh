#!/bin/bash

echo "Webhook received for branch '$1'"

cd /home/ubuntu/Lannootree
git pull

nohup /code/docker-compose.sh &

exit 0