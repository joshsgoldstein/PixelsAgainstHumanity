const path = require('path');
const express = require('express');
const app = express();
const WebSocket = require('ws');
const http = require('http');
const game = require('./game');

app.use(express.static(path.resolve(__dirname, 'build')));
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

wss.broadcast = function broadcast(data) {
  wss.clients.forEach(function each(client) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(data);
    }
  });
};

server.listen(process.env.PORT || 3002, function() {
  var host = server.address().address;
  var port = server.address().port;
  console.log('[WEB] listening at http://%s:%s', host, port);
});

game.newGame(wss);
