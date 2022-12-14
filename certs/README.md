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

This part generates the ca, server, and client certs (the client certs on the server are for connecting MQTT clients DIRECTLY on the server with the broker).

Run the script on the server: [generate_server_certs.sh](generate_server_certs.sh)

```bash
sh generate_server_certs.sh
```

Then run this script on the rpi and by other clients (for ex developers pc for mqtt explorer): [generate_client_certs.sh](generate_client_certs.sh)

```bash
sh generate_client_certs.sh
```

Then copy the .csr file to the server folder: cert/signed_clients/new and run this script: [sign_new_clients.sh](sign_new_clients.sh)

```bash
sh sign_new_clients.sh
```

The generated cert is now inside the signed_clients folder.

Copy the cert file and place it inside the clients client folder as client.crt.

Important: The Common Name of the ca and server needs to be the domain name! The other common names are names for clients.

[guide for server certs](http://www.steves-internet-guide.com/mosquitto-tls/)

[guide for client certs](http://www.steves-internet-guide.com/creating-and-using-client-certificates-with-mqtt-and-mosquitto/)
