#!/bin/sh

# Return and stop the a cert exists
# only the ca is the important cert. because if you delete this cert. you need to sign all clients again.
if [ -f "ca/ca.crt" ] || [ -f "ca/ca.key" ]; then
  echo 'the CA already has a certificate! aborting.'
  return
fi

echo Installing openssl
sudo apt install openssl -y

echo '\n\n\n\nEnter CN (common name). This is the domain name for the server:\n\n'
read CN

echo 'generating CA key and crt in ca folder...'
# Generate CA
openssl genrsa -out ./ca/ca.key 2048
openssl req -new -x509 -days 3650 -key ./ca/ca.key -out ./ca/ca.crt -subj "/CN=LannootreeAuthority/O=Elektronica-ICT/C=BE"

echo 'generating server key and cert in server folder...'
# Generate server certificate and sign it using newly created CA
openssl genrsa -out ./server/server.key 2048
openssl req -new -out ./server/server.csr -key ./server/server.key -subj "/CN=${CN}/O=Elektronica-ICT/C=BE"
openssl x509 -req -in ./server/server.csr -CA ./ca/ca.crt -CAkey ./ca/ca.key -CAcreateserial -out ./server/server.crt -days 3650 -subj "/CN=${CN}/O=Elektronica-ICT/C=BE"

echo 'generating client key and csr in clinet folder...'
# Generate client certificate but don't sign. because clients
openssl genrsa -out ./client/client.key 2048
openssl req -new -out ./client/client.csr -key ./client/client.key -subj "/CN=server_client/O=Elektronica-ICT/C=BE"

echo 'signing client csr and saving the crt in client folder..'
# Sign using this command
openssl x509 -req -in ./client/client.csr -CA ./ca/ca.crt -CAkey ./ca/ca.key -CAcreateserial -out ./client/client.crt -days 3650

echo 'done!'
