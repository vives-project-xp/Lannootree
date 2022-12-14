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

* Controller:
  - In
  - Out
* Panel
  - Control
  - id#...
  - Matrix
  - Frame
* Voronoi
  - In
  - id#...
  - Controll
  - Status
    - ID
  - Out
    - Metadata
* Storage
  - In
    - Metadata
  - Play
  - Status
* Logs: All services can push logs to logs/\<service>
* Status: Shows the status of all MQTT services ex Online or Offline
