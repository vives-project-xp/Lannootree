#!/bin/sh

# Return and stop the a cert exists
if [ -f "client/client.crt" ] || [ -f "client/client.key" ]; then
  echo 'the CA already has a certificate! aborting.'
  return
fi

echo Installing openssl
sudo apt install openssl -y

echo '\n\n\n\nEnter CN (common name) only lowercase and no spaces. This is the name for the client:\n\n'
read CN

echo 'generating client key and csr in clinet folder...'
# Generate client certificate but don't sign. because clients
openssl genrsa -out ./client/client.key 2048
openssl req -new -out ./client/${CN}.csr -key ./client/client.key -subj "/CN=${CN}/O=Elektronica-ICT Vives/C=BE"

echo "done! \ngive ${CN}.csr to the server admin and ask for a signed crt"
echo "then rename the  ${CN}.crt to client.crt and place it in the client folder"

echo "\n\n This is the CSR"
cat ./client/${CN}.csr
