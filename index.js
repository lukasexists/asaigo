import { uvPath } from "uv";
import { join } from "node:path";
import { hostname } from "node:os";

import createBareServer from "@tomphttp/bare-server-node";
import express from "express";

const bare = createBareServer("/bare/");
var app = express();
//var server = require('http').createServer(app);//
var port = process.env.PORT || 3000;

app.listen(port, function () {
  console.log('----< ASAIGO >----\nListening at port %d!', port);
});

app.use(express.static('public'));

const server = createServer();

server.on("request", (req, res) => {
  if (bare.shouldRoute(req)) {
    bare.routeRequest(req, res);
  } else {
    app(req, res);
  }
});

server.on("upgrade", (req, socket, head) => {
  if (bare.shouldRoute(req)) {
    bare.routeUpgrade(req, socket, head);
  } else {
    socket.end();
  }
});

server.on("listening", () => {
  const address = server.address();

  // by default we are listening on 0.0.0.0 (every interface)
  // we just need to list a few
  console.log("Listening on:");
  console.log(`\thttp://localhost:${address.port}`);
  console.log(`\thttp://${hostname()}:${address.port}`);
  console.log(
    `\thttp://${
      address.family === "IPv6" ? `[${address.address}]` : address.address
    }:${address.port}`
  );
});

server.listen({
  port,
});

