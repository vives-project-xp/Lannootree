const net = require('net');

const client = net.createConnection("./build/lannootree.socket");

client.on("connect", () => {
  console.log("Connected to socket");
});

client.on('data', (data) => {
  console.log(data);
});

client.on('error', (err) => {
  console.log(err);
})

let i = 0;
const int = setInterval(() => {
  client.write(Uint8Array.from([0xff, 0x00, 0x00]));
  
  if (i++ == 10) {
    client.write('q');
    client.destroy();
    clearInterval(int);
  }
}, 25);