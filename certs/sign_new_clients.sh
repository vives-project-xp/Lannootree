#!/bin/sh

for file in $(find signed_clients -name "*.csr")
do
  filename=$(basename "$file" ".csr")
  openssl x509 -req -in $file -CA ./ca/ca.crt -CAkey ./ca/ca.key -CAcreateserial -out ./signed_clients/$filename.crt -days 3650
  mv "$file" "signed_clients"
done


echo 'done!'