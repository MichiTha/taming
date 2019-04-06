const { getGuest, updateGuest } = require("./functions/tokens");

const express = require("express");
const bodyParser = require("body-parser");
const functions = require("firebase-functions");
const next = require("next");

const args = process.argv.slice(2);
const isDev = args && args[0] === "--dev";

const app = next({ dev: isDev });
const handle = app.getRequestHandler();
const prepare = app.prepare();

const server = express();
server.use(bodyParser.urlencoded({ extended: false }));
server.use(bodyParser.json());

server.get("/api/:token", getGuest);
server.post("/api/:token", updateGuest);

const routeConfig = [
  {
    route: "/:token",
    page: "/index"
  }
];

routeConfig.forEach(({ route, page }) => {
  server.get(route, (req, res) => app.render(req, res, page, req.params));
});

server.get("*", async (req, res) => {
  await prepare;
  handle(req, res);
});

if (isDev) {
  server.listen(3000, () => console.log(`listening on port 3000!`));
} else {
  exports.next = functions.https.onRequest(server);
}
