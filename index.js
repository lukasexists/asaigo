import { uvPath } from "uv";
import { join } from "node:path";
import { hostname } from "node:os";

import createBareServer from "@tomphttp/bare-server-node";
import express from "express";
var app = express();
var server = require('http').createServer(app);
var port = process.env.PORT || 3000;

server.listen(port, function () {
  console.log('----< ASAIGO >----\nListening at port %d!', port);
});

app.use(express.static('public'));
