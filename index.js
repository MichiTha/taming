const functions = require("firebase-functions");
const next = require("next");

const app = next({});
const handle = app.getRequestHandler();

exports.next = functions.https.onRequest((req, res) =>
  app
    .prepare()
    .then(() =>
      handle(req, res).catch(error => console.log("handle error: ", error))
    )
    .catch(error => console.log("setup error: ", error))
);
