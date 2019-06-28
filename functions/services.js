const { getGuestByToken, updateGuest } = require("./firestore");

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
      confirmed: !!updateRequest.confirmed,
      coming: updateRequest.coming || originalGuest.coming,
      form: updateRequest.form || originalGuest.form,
      token: originalGuest.token
    };

    const guest = await updateGuest(update);
    res.send({ guest });
  } catch (error) {
    console.log("Error getting documents", error);
    res.send(null);
  }
};
