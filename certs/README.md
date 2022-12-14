# Certs

This directory is for everyone that's developing.
The server hosts the CA public key, and you can download it to run applications locally.
This directory also contains all certificates from the CA, server, and clients. Depending on the location of this repository.

## Download CA.crt using bash script

```sh
sh get_ca.sh
```

## SSL-TLS certificate generation

### Files used

- ca (certificate authority)
  - ca.crt: the public certificate of the CA
  - ca. key: private key for the CA, used for signing server crt and client crt's

- server
  - server.csr: certificate signing request for the ca
  - server.crt: pub server key signed by the CA
  - server. key: Private key for MQTT server

- client
  - client.csr: certificate signing request to sign client certs
  - client.crt: a public key for client TLS
  - client.key: Private key for MQTT client

All the files need to be generated, and the ca.crt needs to be shared with the clients.
It can be downloaded to the clients from [this link](https://lannootree.devbitapp.be/ca.crt).

### Generating using script

This part generates the ca, server, and client certs (the client certs are for connecting MQTT clients DIRECTLY on the server with the broker).
If you want to use this only as a client then ignore the server and ca directory.
You need to sign the client certificate. No matter if you're a server or client.

Run the script [generate_certs.sh](generate_certs.sh)

```bash
sh generate_certs.sh
```

Important: The Common Name of the ca and server needs to be the domain name! The other common names are names for clients.
[guide used to make this part](http://www.steves-internet-guide.com/mosquitto-tls/)

## client certificates (certs)

```bash
openssl x509 -req -in ./signed_clients/client.csr -CA ./ca/ca.crt -CAkey ./ca/ca.key -CAcreateserial -out ./signed_clients/client.crt -days 3650
```

[guide used to make this part](http://www.steves-internet-guide.com/creating-and-using-client-certificates-with-mqtt-and-mosquitto/)
