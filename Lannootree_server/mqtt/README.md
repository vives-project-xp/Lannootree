# MQTT setup

## SSL-TLS certificates (ca_certificates)

Generate certificates in the [certs](/certs/README.md) folder.

### files used

- ca.crt: own created certificate authoroty public key. Shared with te public clients
- server.crt: public key for server TLS
- server.key: Private key for mqtt server TLS

All the files need to be generated, the ca.crt needs to be shared with the clients.
It can be downloaded to the clients via [this link](https://lannootree.devbitapp.be/ca.crt)

### Topics

- `controller`
  - in
  - status
- `storage`
  - in
  - out
- `ledpanel`
  - in
  - stream
    - stream_xxx = {"frame":[15,89,35,12,14,47,48...]}
- `logs`
  - \<service1> = (Log message1)
  - \<service2> = (Log message2)
  - \<service...> = ...
- `status`
  - \<service1> = (Online/Offline)
  - \<service2> = (Online/Offline)
  - \<service...> = ...
<!-- - `voronoi`
  - in
  - id#...
  - Controll
  - Status
    - ID
  - Out
    - Metadata -->
<!-- Voronoi doesn't listen over mqtt yet -->
