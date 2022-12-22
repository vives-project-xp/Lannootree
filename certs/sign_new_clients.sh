#!/bin/sh

for file in $(find signed_clients -name "*.csr")
do
  filename=$(basename "$file" ".csr")
  openssl x509 -req -in $file -CA ./ca/ca.crt -CAkey ./ca/ca.key -CAcreateserial -out ./signed_clients/$filename.crt -days 3650
  echo "Certificate for $filename:"
  cat ./signed_clients/$filename.crt
  rm "$file"
done


echo 'done!'
