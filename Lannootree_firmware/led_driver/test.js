const net = require('net');

const client = net.createConnection("./dev/lannootree.socket");

client.on("connect", () => {
  console.log("Connected to socket");
});

client.on('data', (data) => {
  console.log(data);
});

client.on('error', (err) => {
  console.log(err);
})

const Data = new Uint8Array(1024).fill(0xff);
Data[1023] = 0xa5;
console.log(Data);

let i = 0;
const int = setInterval(() => {
  client.write(Data);
  
  if (i++ == 1000) {
    client.destroy();
    clearInterval(int);
  }
}, 1);