# MQTT setup

## SSL-TLS certificates (ca_certificates)

### files used

- ca.crt: own created certificate authoroty public key. Shared with te public clients
- ca.key: own created certificate authoroty private key. For signing other certs
- server.csr: certificate signing request to sign server certs
- server.ca: public key for server TLS
- server.key: Private key for mqtt server TLS

All the files need to be generated, the ca.crt needs to be shared with the clients.
It can be downloaded to the clients via [this link](https://lannootree.devbitapp.be/ca.crt)

### Generating using script

Run the script [generate_certs.sh](mqtt/config/ca_certificate/generate_certs.sh) in mqtt/config/ca_certificate

1. cd into the certificates folder

    ```bash
    cd mqtt/config/ca_certificate
    ```

2. sh generate certs

    ```bash
    sh generate_certs.sh
    ```

Important: The Common Name needs to be the domain name!

### Generating manually

[guide](http://www.steves-internet-guide.com/mosquitto-tls/)

```bash
sudo apt install opensssl -y
```

First create a key pair for the CA

```bash
openssl genrsa -out ca.key 2048
```

Now Create a certificate for the CA using the CA key that we created in step 1

```bash
openssl req -new -x509 -days 3650 -key ca.key -out ca.crt
```

Now we create a server key pair that will be used by the broker

```bash
openssl genrsa -out server.key 2048
```

Now we create a certificate request .csr. When filling out the form the common name is important and is usually the domain name of the server.

```bash
openssl req -new -out server.csr -key server.key
```

Now we use the CA key to verify and sign the server certificate. This creates the server.crt file

```bash
openssl x509 -req -in server.csr -CA ca.crt -CAkey ca.key -CAcreateserial -out server.crt -days 3650
```

## client certificates (certs)

[guide](http://www.steves-internet-guide.com/creating-and-using-client-certificates-with-mqtt-and-mosquitto/)
