# Lannootree firmware

## How to run 

```bash
mkdir ca_crt && cd ca_crt
../../certs/get_ca.sh

cd ..

docker compose up
```

### Note 

Due to a bug in led-driver the sockets won't delete by themself, so if you restart contanair you will have to run:

```bash
sudo rm -rf /var/run/lannootree.socket && sudo rm -rf /var/run/logging.socket
```

In order to remove those sockets, if you don't do thats things will not work.
