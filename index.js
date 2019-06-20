const functions = require("firebase-functions");
const express = require("express");

const server = express();

// Startup IIFE
(async () => {
  const bodyParser = require("body-parser");
  const next = require("next");

  const { getGuest, updateGuest } = require("./functions/services");

  const args = process.argv.slice(2);
  const isDev = args && args[0] === "--dev";

  const app = next({ dev: isDev });

  // initialize services
  server.use(bodyParser.urlencoded({ extended: false }));
  server.use(bodyParser.json());
  server.get("/api/:token", getGuest);
  server.post("/api/:token", updateGuest);

  // initialize custome client routes
  const routeConfig = [
    {
      route: "/:token",
      page: "/index"
    }
  ];
  routeConfig.forEach(({ route, page }) => {
    server.get(route, (req, res) => app.render(req, res, page, req.params));
  });

  // initialize default client routes
  const defaultRequestHandler = app.getRequestHandler();
  const prepare = app.prepare();
  await prepare;
  server.get("*", (req, res) => defaultRequestHandler(req, res));

  // start dev server
  if (isDev) {
    server.listen(3000, () => console.log(`listening on port 3000!`));
  }
})();

exports.next = functions.https.onRequest(server);
