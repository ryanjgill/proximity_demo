const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const five = require("johnny-five");
const board = new five.Board({
  repl: false
});

server.listen(3000);

app.use(express.static('public'))

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/public/index.html');
});

io.on('connection', function (socket) {
  socket.emit('news', { hello: 'world' });
  socket.on('my other event', function (data) {
    console.log(data);
  });
});

board.on("ready", function() {
  const proximity = new five.Proximity({
    controller: "HCSR04",
    pin: 7,
    freq: 100
  });

  const proximity2 = new five.Proximity({
    controller: "HCSR04",
    pin: 8,
    freq: 100
  });

  let distance = 0;

  // proximity.on("data", function() {
  //   io.emit('distance', this.cm);
  // });

  proximity.on("change", function() {
    const threshold = .5;
    let delta = Math.abs(this.cm - distance)
    distance = delta > threshold ? this.cm : distance

    if (delta > threshold) {
      //console.log("  cm  : ", distance);
      io.emit('distance', distance);
    }
  });

  proximity2.on("change", function() {
    const threshold = .5;
    let delta = Math.abs(this.cm - distance)
    distance = delta > threshold ? this.cm : distance

    if (delta > threshold) {
      //console.log("  cm  : ", distance);
      io.emit('distance2', distance);
    }
  });
});
