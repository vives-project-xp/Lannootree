#!/bin/sh

sudo apt install openssl -y

# Generate CA 
openssl genrsa -out ./ca/ca.key 2048
openssl req -new -x509 -days 3650 -key ./ca/ca.key -out ./ca/ca.crt

# Generate server certificate and sign it using newly created CA
openssl genrsa -out ./server/server.key 2048
openssl req -new -out ./server/server.csr -key ./server/server.key
openssl x509 -req -in ./server/server.csr -CA ./ca/ca.crt -CAkey ./ca/ca.key -CAcreateserial -out ./server/server.crt -days 3650

# Generate client certificate but don't sign. because clients 
openssl genrsa -out ./client/client.key 2048
openssl req -new -out ./client/client.csr -key ./client/client.key