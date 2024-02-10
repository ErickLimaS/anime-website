const dotenv = require("dotenv");
const admin = require("./firebase/firebase-config");

dotenv.config();

async function checkUserIsAuth(req, res, next) {
  
  const authorization = req.headers.authorization;

  if (!authorization)
    return res.status(401).send({ message: "No Token Found" });

  //gets token after char 7: BEARER ******
  const token = authorization.slice(7, authorization.length);

  try {
    const valueDecoded = await admin.auth().verifyIdToken(token);

    console.log(valueDecoded);

    if (valueDecoded) {
      // insert on body the user info
      req.body.user = valueDecoded;
      req.body.user._id = req.body.user.user_id;

      return next();
    }

    return res.status(401).json({ message: "Token Doesnt Match" });
  } catch (err) {
    return res.status(500).json(err);
  }
}

module.exports = {
  checkUserIsAuth,
};
