#!/bin/bash

cd /home/ubuntu/Lannootree/Lannootree_server
docker-compose up -d --build frontend admin-api client-api controller storage > /dev/null