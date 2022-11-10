const net = require('net');

// const client = net.createConnection("/var/run/lannootree.socket");
const client = net.createConnection("./logging.socket");

client.on("connect", () => {
  console.log("Connected to socket");
});

client.on('data', (data) => {
  console.log(data);
});

client.on('error', (err) => {
  console.log(err);
})


// let i = 0;
// console.time("240 fps");
// const interval2 = setInterval(() => {
//   let color = {
//     r: Math.floor((Math.random() * 129)),
//     g: Math.floor((Math.random() * 129)),
//     b: Math.floor((Math.random() * 129))
//   }
//   let random = Math.floor((Math.random() * 129));
//   let matrix = new Array(288 * 3)
//   .fill(0)
//   .map(e => random);



//   client.write(Uint8Array.from(matrix));

//   // if (i++ > 60) {
//   //   console.timeEnd("240 fps");
//   //   clearInterval(interval2);
//   //   client.destroy();
//   // }
// }, 100);

