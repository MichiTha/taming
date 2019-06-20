const admin = require("firebase-admin");
const serviceAccount = require("../serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

const guestCollection = db.collection("guests");

exports.getGuestByToken = token =>
  new Promise((resolve, reject) =>
    guestCollection
      .where("token", "==", token)
      .get()
      .then(snapshot => {
        let guest = null;
        snapshot.forEach(doc => (guest = doc.data()));
        resolve(guest);
      })
      .catch(error => reject(error))
  );

exports.updateGuest = guest =>
  new Promise((resolve, reject) =>
    guestCollection
      .where("token", "==", guest.token)
      .get()
      .then(snapshot => {
        snapshot.forEach(doc => guestCollection.doc(doc.id).update(guest));
        resolve(guest);
      })
      .catch(error => reject(error))
  );
