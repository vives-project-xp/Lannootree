# Certs

This directory is for everyone that's developing.
The server hosts the CA public key, and you can download it to run applications locally.
This directory also contains all certificates from the CA, server and clients. depending on the location of this repo.

## Download CA.crt using bash script

```sh
sh get_ca.sh
```

## SSL-TLS certificate generation

### files used

- ca.crt: own created certificate authoroty public key. Shared with te public clients
- ca.key: own created certificate authoroty private key. For signing other certs

- server.csr: certificate signing request to sign server certs
- server.crt: public key for server TLS
- server.key: Private key for mqtt server TLS

- client.csr: certificate signing request to sign client certs
- client.crt: public key for client TLS
- client.key: Private key for mqtt client TLS

All the files need to be generated, the ca.crt needs to be shared with the clients.
It can be downloaded to the clients from [this link](https://lannootree.devbitapp.be/ca.crt).

### Generating using script

This part generates the ca, server and client certs (the client certs are for connecting mqtt clients DIRECTLY on the server with the broker).
If you want to use this only as a client, then ignore the server and ca directory.
You need to sign the client certificate. no matter if you're a server or client.

Run the script [generate_certs.sh](generate_certs.sh)

```bash
sh generate_certs.sh
```

Important: The Common Name needs to be the domain name for the ca! The other common names are the names of the server and clients.
[guide used to make this part](http://www.steves-internet-guide.com/mosquitto-tls/)

## client certificates (certs)

```bash
openssl x509 -req -in ./signed_clients/client.csr -CA ./ca/ca.crt -CAkey ./ca/ca.key -CAcreateserial -out ./signed_clients/client.crt -days 3650
```

[guide used to make this part](http://www.steves-internet-guide.com/creating-and-using-client-certificates-with-mqtt-and-mosquitto/)
