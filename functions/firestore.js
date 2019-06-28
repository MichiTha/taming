const admin = require("firebase-admin");
const serviceAccount = require("../serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

const guestCollection = db.collection("guests");

const getData = (doc, resolve, reject) => {
  if (doc.exists) {
    resolve(doc.data());
  } else {
    reject("No such document!");
  }
};

exports.getGuestByToken = token =>
  new Promise((resolve, reject) =>
    guestCollection
      .doc(token)
      .get()
      .then(doc => getData(doc, resolve, reject))
      .catch(error => reject(error))
  );

exports.updateGuest = guest =>
  new Promise((resolve, reject) =>
    guestCollection
      .doc(guest.token)
      .update(guest)
      .then(doc => getData(doc, resolve, reject))
      .catch(error => reject(error))
  );

exports.addGuest = guest =>
  new Promise((resolve, reject) =>
    guestCollection
      .doc(guest.token)
      .set(guest)
      .then(doc => getData(doc, resolve, reject))
      .catch(error => reject(error))
  );
