const net = require('net');

const client = net.createConnection("./build/lannotree.socket");

client.on("connect", () => {
  console.log("Connected to socket");
});

client.on('data', (data) => {
  console.log(data);
});

client.on('error', (err) => {
  console.log(err);
})

setInterval(() => {
  client.write(Uint8Array.from([0xff, 0x00, 0x00]));
}, 1000);