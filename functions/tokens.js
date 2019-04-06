const { firestore } = require("./firestore");

const guestCollection = firestore.collection("guests");

const getGuestByToken = token =>
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

const updateGuest = guest =>
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

exports.getGuest = async (req, res) => {
  const { token } = req.params;
  try {
    const guest = await getGuestByToken(token);
    res.send({ guest });
  } catch (error) {
    console.log("Error getting documents", error);
    res.send(null);
  }
};

exports.updateGuest = async (req, res) => {
  const { token } = req.params;
  const updateRequest = req.body || {};
  try {
    const originalGuest = await getGuestByToken(token);

    const update = {
      ...originalGuest,
      confirmed: updateRequest.confirmed || false,
      people: updateRequest.people || 1,
      token: originalGuest.token
    };

    const guest = await updateGuest(update);
    res.send({ guest });
  } catch (error) {
    console.log("Error getting documents", error);
    res.send(null);
  }
};
