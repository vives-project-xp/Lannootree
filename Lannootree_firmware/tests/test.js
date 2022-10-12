const net = require('net');

const client = net.createConnection("/var/run/lannootree.socket");

client.on("connect", () => {
  console.log("Connected to socket");
});

client.on('data', (data) => {
  console.log(data);
});

client.on('error', (err) => {
  console.log(err);
})

// const Data = new Uint8Array(5000 * 3).fill(0xff); // 5000 leds RGB

// let i = 0;
// console.time("240fps");
// const interval = setInterval(() => {
//   client.write(Data)

//   if (i++ > 240) {
//     console.timeEnd("240fps");
//     client.destroy()
//     clearInterval(interval);
//   }
// }, 4); // 999.993ms

// const matrix = new Array(10*3).fill(new Array(10*3).fill(() => { return Math.floor((Math.random() * 255)); }));
const matrix = new Array(2 * 3)
  .fill(0)
  .map(e => new Array(2 * 3)
    .fill(0)
    .map(e => Math.floor(Math.random() * 255))
  );

// console.log(matrix);
// console.log(Uint8Array.from([].concat(...matrix)));

let i = 0;
console.time("60 fps");
const interval2 = setInterval(() => {
  client.write(Uint8Array.from([].concat(...matrix)));

  if (i++ > 60) {
    console.timeEnd("60 fps");
    clearInterval(interval2);
    client.destroy();
  }
}, 16);

