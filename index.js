import createBareServer from "@tomphttp/bare-server-node";
import express from "express";
import { createServer } from "node:http";
import { uvPath } from "uv";
import { join } from "node:path";
import { hostname } from "node:os";

console.log(uvPath);

const bare = createBareServer("/bare/");
const app = express();

// Load our publicPath first and prioritize it over UV.
app.use(express.static("public"));

// Error for everything else
app.use((req, res) => {
  res.status(404);
  res.sendFile(join("public", "404.html"));
});

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

let port = parseInt(process.env.PORT || "");

if (isNaN(port)) port = 8080;

server.on("listening", () => {
  const address = server.address();

  console.log("Listening at:\n");
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
